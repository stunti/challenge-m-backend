package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"time"

	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/option"

	"github.com/fsnotify/fsnotify"
)

type Website struct {
	Date   string `json:"date"`
	Name   string `json:"name"`
	Visits int    `json:"visits"`
}

func main() {
	if len(os.Args) != 2 {
		log.Fatalln("error")
	}
	filename := os.Args[1]
	err := waitUntilFind(filename)
	if err != nil {
		log.Fatalln(err)
	}

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatalln(err)
	}
	defer watcher.Close()

	err = watcher.Add(filename)
	if err != nil {
		log.Fatalln(err)
	}

	uploadCh := make(chan bool)
	// removeCh := make(chan bool)
	errCh := make(chan error)

	go func() {
		for {
			select {
			case event := <-watcher.Events:
				switch {
				case event.Op&fsnotify.Write == fsnotify.Write:
					log.Printf("Write:  %s: %s", event.Op, event.Name)
					uploadCh <- true
					// case event.Op&fsnotify.Create == fsnotify.Create:
					// 	log.Printf("Create: %s: %s", event.Op, event.Name)
					// case event.Op&fsnotify.Remove == fsnotify.Remove:
					// 	log.Printf("Remove: %s: %s", event.Op, event.Name)
					// 	removeCh <- true
					// case event.Op&fsnotify.Rename == fsnotify.Rename:
					// 	log.Printf("Rename: %s: %s", event.Op, event.Name)
					// 	renameCh <- true
					// case event.Op&fsnotify.Chmod == fsnotify.Chmod:
					// 	log.Printf("Chmod:  %s: %s", event.Op, event.Name)
				}
			case err := <-watcher.Errors:
				errCh <- err
			}
		}
	}()

	go func() {
		for {
			select {
			case <-uploadCh:
				err = waitUntilFind(filename)
				if err != nil {
					log.Fatalln(err)
				}
				err = watcher.Add(filename)
				if err != nil {
					log.Fatalln(err)
				}
				upload(filename)
				// case <-removeCh:
				// 	err = waitUntilFind(filename)
				// 	if err != nil {
				// 		log.Fatalln(err)
				// 	}
				// 	err = watcher.Add(filename)
				// 	if err != nil {
				// 		log.Fatalln(err)
				// 	}
			}
		}
	}()

	log.Fatalln(<-errCh)
}

func upload(filename string) {
	var err error
	csvFile, _ := os.Open(filename)
	reader := csv.NewReader(bufio.NewReader(csvFile))
	reader.Comma = '|'
	var websites []Website
	for {
		line, error := reader.Read()
		if error == io.EOF {
			break
		} else if error != nil {
			log.Fatal(error)
		}
		var visit int
		visit, err = strconv.Atoi(line[2])
		if err != nil {
			fmt.Printf("Cannot evaluate #%v\n", line)
			continue
		}
		var dt time.Time
		dt, err = time.Parse("2006-01-02", line[0])
		if err != nil {
			fmt.Printf("Cannot evaluate #%v\n", line)
			continue
		} //2016-01-06T00:00:00.000Z
		websites = append(websites, Website{
			Date:   dt.Format("2006-01-02T15:04:05.000Z"),
			Name:   line[1],
			Visits: visit,
		})
	}
	websiteJson, _ := json.Marshal(websites)
	fmt.Println(string(websiteJson))

	// firebase
	ctx := context.Background()
	config := &firebase.Config{
		DatabaseURL: "https://challenge-m-backend.firebaseio.com",
	}
	opt := option.WithCredentialsFile("./challenge-m-backend-cacde0f5638f.json")
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatal(err)
	}

	client, err := app.Database(ctx)
	if err != nil {
		log.Fatal(err)
	}

	if err := client.NewRef("websites").Set(ctx, websites); err != nil {
		log.Fatal(err)
	}
}

func waitUntilFind(filename string) error {
	for {
		time.Sleep(1 * time.Second)
		_, err := os.Stat(filename)
		if err != nil {
			if os.IsNotExist(err) {
				continue
			} else {
				return err
			}
		}
		break
	}
	return nil
}

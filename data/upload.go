package main

import (
    "bufio"
    "encoding/csv"
    "encoding/json"
    "fmt"
    "io"
    "log"
		"os"
		"time"
		"strconv"

		firebase "firebase.google.com/go"
		"golang.org/x/net/context"
		"google.golang.org/api/option"
)

type Website struct {
    Date time.Time   `json:"date"`
    Name  string   `json:"website"`
    Visits   int `json:"visits"`
}



func main() {
	var err error
    csvFile, _ := os.Open("data.csv")
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
				if err !=nil {
					fmt.Printf("Cannot evaluate #%v\n", line)
					continue;
				}
				var dt time.Time
				dt, err =  time.Parse("2006-01-02", line[0])
				if err !=nil {
					fmt.Printf("Cannot evaluate #%v\n", line)
					continue;
				}
        websites = append(websites, Website{
            Date: dt,
            Name:  line[1],
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

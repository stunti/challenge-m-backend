# challenge-m-backend

## Purpose
Backend code for the M challenge.
The api description can be found at:
http://134.209.101.26:3000/api

The backend is separated in 2 different concerns.
- Data upload which is an internal process is created in Go: https://github.com/stunti/challenge-m-backend/tree/master/data
- The backend of the public service is based on Node.js.

## Technical description
 
The database is Firebase and is used to stored autheticated users and websites
The backend use NestJS with the entire code in TypeScript. 
It uses multiple services to address each one of the concern:
- Website is the service to provide data for the information displayed: https://github.com/stunti/challenge-m-backend/tree/master/src/modules/website/service/website
- Blocking is the service to keep a list of website to not show: https://github.com/stunti/challenge-m-backend/tree/master/src/modules/website/service/blocking
- Firebase is the service to communicate with the database: https://github.com/stunti/challenge-m-backend/tree/master/src/modules/website/service/firebase
- Auth is the service to authenticate users: https://github.com/stunti/challenge-m-backend/tree/master/src/modules/auth/service/auth

## Deployment

Deployment can be done using automation websites or tools. Experiments have been made with CircleCI.
The backend is hosted on Digitalocean but it could easily be hosted on another VM or transformed to be in a serverless environment.

## Additional enhancements
- Track usage and specially statistics on most used dates to improve UI and generate usage report.
- Create aggregated api to display different list and generate charts



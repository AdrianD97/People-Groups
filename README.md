# People-Groups

## Overview

The scope of the project is to facilitate the organization of People into Groups.

## Technologies

- Backend: Node.js, Typescript, Express.js
- Database: MySQL
- Caching: Redis

## Start the server

In order to start the server, the following environment variables must be defined:
```bash
PORT= # server port
HOST= # server host
DB_HOST= # database server host
DB_PORT= # database server port
DB_NAME= # database name
DB_USERNAME= # database user
DB_PASSWORD= # database password
ROUNDS= # used when generate authorization token
SECRET_KEY= # the secret key used to sign the authorization token
EXPIRES_IN= # how many seconds the token is valid
CACHE_HOST= # cache server host
CACHE_PORT= # cache server port
CACHE_PASSWORD= # cache password
```

- build
```bash
npm run build
```

- start
```bash
npm run start
```

- start without running the build command
```bash
npm run start:dev
```

## APIs

### Login

1. #### login

- route
```
POST <host>/auth/login
```

- request
```JSON
{
    "username": "adrian",
    "password": "password"
}
```

- response

if the operation has succeeded, the response contains a JWT token than can be used to authorize the user

```JSON
{
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkcmlhbiIsImlhdCI6MTY5NDYwNDE5MSwiZXhwIjoxNjk0NjkwNTkxfQ.GJVDXmkOLIVE5my-v2S3Nlp5R4eXIFLiVRxbB0lbWk0",
	"username": "adrian",
	"role": 0,
	"created_at": "2023-09-10T06:16:01.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
    "message": "invalid credentials"
}
```

### Manage people API

#### 1. Create a new person

- route
```
POST <host>/api/v1/persons
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request
```JSON
{
	"first_name": "Alexandru",
	"last_name": "Stefan",
	"job": "Inginer",
	"group_id": 10
}
```

***OBS***: If group id is missing, then the person will be created, but won't be a member of any group.

- response

if the operation was successful, the response of the API contains data of the new created person.
```JSON
{
	"id": 31,
	"first_name": "Alexandru",
	"last_name": "Stefan",
	"job": "Inginer",
	"created_at": "2023-09-13T08:45:51.000Z",
	"updated_at": "2023-09-13T08:45:51.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "Mandatory property is missing - Job is required"
}
```

#### 2. Update a person

- route
```
PUT <host>/api/v1/persons/:person_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request
```JSON
{
	"first_name": "Marian",
	"job": "Inginer"
}
```

***OBS***: Any of the following properties can be updated: first_name, last_name and job.

- response

if the operation was successful, the response of the API contains data of the updated person.
```JSON
{
	"id": 31,
	"first_name": "Marian",
	"last_name": "Stefan",
	"job": "Drujbar",
	"created_at": "2023-09-13T08:45:51.000Z",
	"updated_at": "2023-09-13T08:47:16.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

#### 3. Delete a person

- route
```
DELETE <host>/api/v1/persons/:person_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, then a success message will be received.
```JSON
{
	"message": "resource deleted"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

#### 4. Add a person to a group

- route
```
PATCH <host>/api/v1/persons/:person_id/add/:group_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, the response of the API contains data of the person added to the given group.
```JSON
{
	"id": 4,
	"first_name": "Adrian",
	"last_name": "Mihalcea",
	"job": "Mecanic",
	"created_at": "2023-09-10T06:15:22.000Z",
	"updated_at": "2023-09-10T06:15:22.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "server error"
}
```

#### 5. Remove a person from a group

- route
```
PATCH <host>/api/v1/persons/:person_id/remove/:group_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, then a success message will be received.
```JSON
{
	"message": "resource deleted"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```


### Manage groups API

#### 1. Create a new group

- route
```
POST <host>/api/v1/groups
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request
```JSON
{
	"name": "Test Group",
	"parent_id": 10
}

```

***OBS***: If parent id is missing, then the group will be created with no parent set (parent_id will be set to null)

- response

if the operation was successful, the response of the API contains data of the new created group.
```JSON
{
	"id": 15,
	"name": "Test Group",
	"parent_id": 10,
	"created_at": "2023-09-13T08:59:09.000Z",
	"updated_at": "2023-09-13T08:59:09.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "Mandatory property is missing - Group Name is required"
}
```

#### 2. Update a group

- route
```
PUT <host>/api/v1/groups/:group_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request
```JSON
{
    "name": "Munchen"
}
```

- response

if the operation was successful, the response of the API contains data of the updated group.
```JSON
{
	"id": 15,
	"name": "Munchen",
	"parent_id": 10,
	"created_at": "2023-09-13T08:59:09.000Z",
	"updated_at": "2023-09-13T09:45:52.000Z"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

#### 3. Delete a group

- route
```
DELETE <host>/api/v1/groups/:group_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, then a success message will be received.
```JSON
{
	"message": "resource deleted"
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

#### 4. Move people from a group to another group

- route
```
PATCH <host>/api/v1/groups/:group_id/move_people/:newGroup_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, then the API respnse wil contain the number of persons moved
```JSON
{
	"movedNo": 4
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "server error"
}
```

#### 5. Move a group to another group

- route
```
PATCH <host>/api/v1/groups/:group_id/move_group/:newParent_id
```

***OBS***: If newParent_id is 0, then the group will have no parents.

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- request

No body

- response

if the operation was successful, then the API response will be
```JSON
{
	"succes": true
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

### Manage hierarchy API

#### 1. Get hierarchy

- route
```
GET <host>/api/v1/hierarchy
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- response

if the operation was successful, then the whole hierarchy will be received
```JSON
{
	"Dashboard - G-1": {
		"Content - G-2": {
			"Modules-test - G-4": {
				"members": [
					"Green Van (Bucatar) - P-5"
				]
			},
			"Adrians - G-9": {
				"Bayern - G-10": {
					"test-1 - G-14": {},
					"Munchen - G-15": {},
					"Test Group-new-new - G-17": {},
					"members": [
						"Marian Stefan (Drujbar) - P-28",
						"Alexandru Stefan (Inginer) - P-29",
						"Alexandru Stefan (Inginer) - P-30",
						"Marian Stefan (Drujbar) - P-31"
					]
				}
			},
			"members": [
				"Carmen Florea (Chelnerita) - P-3"
			]
		},
		"User Modules - G-5": {
			"Modules - G-3": {
				"Categories - G-6": {
					"Dinamo - G-8": {
						"members": [
							"Green Van (Bucatar) - P-5"
						]
					},
					"members": [
						"Adrian Mihalcea (Mecanic) - P-4"
					]
				},
				"Test-cat - G-7": {}
			},
			"members": [
				"Radu Ninel (Bucatar) - P-2",
				"Green Van (Bucatar) - P-5"
			]
		},
		"members": [
			"Josh Henry (Mecanic) - P-1"
		]
	}
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "server error"
}
```

#### 2. Get person ancestors

- route
```
GET <host>/api/v1/hierarchy/person/:person_id
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- response

if the operation was successful, then the whole hierarchy will be received
```JSON
{
	"ancestors": [
		[
			"Modules-test - G-4",
			"Content - G-2",
			"Dashboard - G-1"
		],
		[
			"User Modules - G-5",
			"Dashboard - G-1"
		],
		[
			"Dinamo - G-8",
			"Categories - G-6",
			"Modules - G-3",
			"User Modules - G-5",
			"Dashboard - G-1"
		]
	]
}
```

***OBS***: The hierarchy could be an array of array as a personc can be member of different groups

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```

#### 3. Get hierarchy for a given group

- route
```
GET <host>/api/v1/hierarchy/group/:group_id
```

***OBS***: You can filter group members by job title or first name. You can specify the list of filters as query strings

```
GET <host>/api/v1/hierarchy/group/:group_id?first_name="Ninel"
```

- headers

The request must contains authorization header
```bash
authorization = Bearer <token>
```

- response

if the operation was successful, then the whole hierarchy will be received
```JSON
{
	"User Modules - G-5": {
		"Modules - G-3": {
			"Categories - G-6": {
				"Dinamo - G-8": {
					"members": [
						"Green Van (Bucatar) - P-5"
					]
				},
				"members": [
					"Adrian Mihalcea (Mecanic) - P-4"
				]
			},
			"Test-cat - G-7": {}
		},
		"members": [
			"Radu Ninel (Bucatar) - P-2",
			"Green Van (Bucatar) - P-5"
		]
	}
}
```

if the operation failed, then the response contains an error message. See below an example of possible error message:
```JSON
{
	"message": "resource not found"
}
```


## Technical details

### Architecture
![](./group-person.png)


### Database diagram
![](./database.png)

#### Cache diagram

To quickly access hierrachy, it was stored into cache under a tree structure. The tree structure was implemented using hash and set structures, as Redis has support for these. For each group and person there is a hash structure used to keep its details. Sets structures are used to store children of each group and parents of each person (as a person can be member of multiple groups). There is a set structure for each group (which has at least a child) and for each person.

![](./cache.png)

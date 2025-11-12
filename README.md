This is documentation of WiseAI assessment.

## Tech Stack:
- React Native / Expo
- Prisma
- JWT (Bearer Token on Header) (Mobile apps dont support cookies)
- AsyncStorage (To store JWT token and user data) 
- MongoDB
- Zod
- Express
- React Query
- React Hook Form
- Axios

## Setup(backend): 
Inorder to setup backend:
- Clone the repo
- run pnpm install
- npx prisma generate / pnpm prisma generate
- npx prisma db pull / pnpm prisma db pull ( to run migration files)
- create .env files
```
DATABASE_URL="your_DB_url"
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="7d"
```
- pnpm run dev


## Setup(mobile):
- Clone repo
- yarn install ( used yarn because react native have many dependency erros and sometimes pnpm might have problems with libraries) 
- add .env file
- npx expo run:android
```
EXPO_PUBLIC_API_URL=""
```
**Running expo or mobile app is a hassle, most probably won't work on first time because it has a lot of dependencies errors.**
**Your node version might be problem.**
**You might not have java**
**Your java version might not be compatible with react native version**
**Gradle errors and so on**

### Endpoints:
**Some endpoints are not used but they are normally in an enterpris system having more roles(Mainly admin and superAdmin)**
## User
GET /users -> (Auth required) -> Get all User (NOT USED IN APP)
GET /users/:id -> (Auth required) -> Get individual User
PUT /users/:id -> (Auth required) -> Update User
DELETE /users/:id -> (Auth required) -> Delete User

## Properties (AUTH REQUIRED ON ALL ROUTES)
GET /properties/my -> get my properties
GET /properties/recommend -> get recommended properties
GET /properties/:id/similar -> get similar properties to the current property (Did not connect to mobile app)
GET /properties/:id -> get property details
POST /properties -> (FORM VALIDATED USING ZOD IN BE AND FE) -> Create property
PUT /properties/:id -> (FORM VALIDATED USING ZOD IN BE AND FE) -> Update property
DELETE /properties/:id -> Delete property

## Auth (OPEN route)
POST /register -> (FORM VALIDATED USING ZOD IN BE AND FE) -> Register user
POST /login -> (FORM VALIDATED USING ZOD IN BE AND FE) -> Login (Get access and refresh token)
POST /refresh -> Refresh accessToken

## Favourite
GET /favourites -> (Auth required) -> get favourites of a user
POST /favourites -> (Auth required) -> create favourites of a user
DELETE /favourites/:id -> (Auth required) -> delete by favourite id -> Now that i think of using this would be more efficient.
DELETE /favourites/user/:userId/property/:propertyId -> (Auth required) -> delete by userId and property Id -> using this as it was easier to get userId and propertyId.

## Image
POST /upload -> FILE (to upload image)


### Recommendation System
The recommendation logics are on **recommendation.service.ts** 
There are there methods used to get 5 recommendation depending on the need.
- Collaborative Based (First Priority) -> People who have liked similar property.(The way tiktok works)
- Content Based (Mid Priority) -> Check similar content by city ,propertyType and price.
- Popular Based (Least Priority) -> This is shown to the new users.
  
**Other method would be to use embedding and vectorDB but I did not have enough time to setup those and have no prior experience using mongodb vector search. I have used pg_vector for postgres**


###Journey through out development:
First day i spent most of my time on properly initializing the projects. This includes setting up Prisma , models , routes , controllers on the backend side.
On the mobile app, I setup libraries but had problem on running the app in android due to version mismatch of various libraries. The nativewind did not support latest react reanimated due to which
I was having problem a debug apk to connect to my phone direclty.
I started project first by setting up postgres in docker but found out i need to use mongo.I tried running locally but thought hosting would be hassle so used mongodb atlas.

**I did not use expo go because it does not support native modules and on long run it is always better to use deubg apk for development**
I ended the day successfully running my app on the phone.


Second day, I started working on the UI of the mobile and routes. Started with home page , then added onboarding pages. Most of the time of development was spent on making routes protected and handling tokens.
It seems expo have changed the way to handle protected routes as last time i used different approch. This day was productive day as i connected various api such as favourite , properties. Ended my day by completing 
the favourite module.

Third day, on the finaly day i completed rest of the work such as property recommendation, update of the property , delete of property. After completeing these i worked on hosting the backend and connected to the live on.
Most of the time this day was spent on fixing bugs and changing flow of application.
I tried using uploadthing for file upload but i was getting error while logging in through github so i ditched that idea and used local file system.




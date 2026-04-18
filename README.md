# Assignment Three

## Elmers Submission
[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/51950213-e3fe3989-d7ce-4fed-beec-512c51dd65eb?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D51950213-e3fe3989-d7ce-4fed-beec-512c51dd65eb%26entityType%3Dcollection%26workspaceId%3Dd6817412-7dd9-4123-b44d-91c7f562e7d4#?env%5Bhernandez-HW3%5D=W3sia2V5Ijoiand0IiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpZNVltRTFNRGhsTVRFeU9EVTJNRFkyTURCbE4yUTBOaUlzSW5WelpYSnVZVzFsSWpvaWFtaHZia0JsZUdGdGNHeGxMbU52YlNJc0ltbGhkQ0k2TVRjM016Z3kuLi4iLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqWTVZbUUxTURobE1URXlPRFUyTURZMk1EQmxOMlEwTmlJc0luVnpaWEp1WVcxbElqb2lhbWh2YmtCbGVHRnRjR3hsTG1OdmJTSXNJbWxoZENJNk1UYzNNemd5TWpJd055d2laWGh3SWpveE56Y3pPREkxT0RBM2ZRLkwzWXZRbGZtbXpWeUdwbktnUi1kVDRzY1pqV2RZU0FYeVlKR3RSS2VRSDQiLCJzZXNzaW9uSW5kZXgiOjB9LHsia2V5IjoiYXV0aC1oZWFkZXIiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiSldUIHt7and0fX0iLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6IkpXVCB7e2p3dH19Iiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6InRpdGxlIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IldlYXRoZXJpbmcgd2l0aCBZb3UiLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6IldlYXRoZXJpbmcgd2l0aCBZb3UiLCJzZXNzaW9uSW5kZXgiOjJ9XQ==)
## Elmers React site URL
https://csc3916-react19-hjd2.onrender.com/

## Purpose
The purpose of this assignment is to get comfortable working with a NoSQL database (MongoDB). 

For this assignment you will create a Users collection to store users for your signup and signin methods.  You will pass Username, Name and Password as part of signup.  To get a token you will call SingIn with username and password only.  The token should include the Name and UserName (not password)

You will also create Movies collection to store information about movies.  All endpoints will be protected with the JWT token received by a signin call. 

## Requirements
Create a collection in MongoDB to hold information about movies
- Each entry should contain the following
    - title (string, required, index)
    - releaseDate
    - genre (Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller, Western, Science Fiction)
    - Array of three actors that were in the film
        - actorName
        - characterName
    - The movie collection should have at least five movies
- Create a NodeJS Web API to interact with your database
    - Follow best practices (e.g. /movies collection)
    - Your API should support all CRUD operations (through HTTP POST, PUT, DELETE, GET)
    - Ensure incoming entities contain the necessary information.  For example if the movie does not contain actors, the entity should not be created and an error should be returned 
- All endpoints should be protected with a JWT token (implement signup, and signin)
    - For this assignment you must implement a User database in Mongo
        - name
        - username 
        - password (should be hashed)
    - If username exists the endpoint should return an error that the user already exists
    - JWT secret needs to be stored in an environment variable
- Update the Pre-React CSC3916_REACT placeholder project to support /signup and /signin methods.  The React Single Page App should use your Assignment 3 API to support those two operations.

## Submissions
- All source code should be stored on github (remember .gitignore for node_modules)
- API needs to be deployed to heroku or render
- React Website that allows user to signup and singin (we did this in class)
- PostMan test collection that 
    - Signs Up a user (create a random user name and random password in your pre-test)
    - SignIn a User – parse token and store in postman environment variable
    - A separate call for each endpoint (save a movie, update a movie, delete a movie and get a movie)
    - Test error conditions (user already exists)
        - SignUp (user already exist)
        - Save Movie (missing information like actors (must be at least three), title, year or Genre)

- Create a readme.md at the root of your github repository with the embedded (markdown) to your test collection
    - Within the collection click the (…), share collection -> Embed
    - Static Button
    - Click update link
    - Include your environment settings
    - Copy to clipboard 
- Submit the Url to canvas with the REPO CSC_3916
- Note: All tests should be testing against your Heroku or Render endpoint

| Route | GET | POST | PUT | DELETE |
| --- | --- | --- | --- | --- |
| movies | Return all movies| save a single movie | FAIL | FAIL |
| movies/:movieparameter | Return a specific movie based on the :movieparameter | FAIL | Update the specific movie based on the :movieparameter in your case it’s the title | Delete the specific movie based on the :movieparamters your case it’s the title |*

* If Query String (Later Homework) reviews=true aggregate in reviews |

## Rubic
- -5 for missing REACT site (-2 if you are not able to signup or signin on the react site) that is all we implemented
- -1 for MovieSchema missing any of the attributes (array of actors, genre, year released or title)
- -2 for missing routes for /movies (POST/PUT/DELETE/GET)
- -1 for missing authentication on routes
- -2 for not deployed on Heroku/Render
- -1 missing Test error conditions
- -1 missing PostMan tests (signup, signin, separate call for each route)

## Resources
- https://www.mongodb.com/cloud/atlas
- Create a Free Subscription *Amazon
- https://render.com/docs/deploy-create-react-app **important: Environment Variable for https://github.com/AliceNN-ucdenver/CSC3916_REACT env.REACT_APP_API_URL, this weekend I will look at changes (I believe only 1 change in the actions)

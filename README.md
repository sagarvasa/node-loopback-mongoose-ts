# node-loopback-mongoose-ts
Implementation of APIs in node using Loopback 4, Mongoose and Typescript

# steps to start and configure server
1. Clone/Fork the repo in your workspace.
2. `cd vendor` and Make sure node version is higher than mentioned in package.json
2. install the dependancies using `npm install` in vendor folder. 
3. run your mongodb server and change configuration at helper/config.js if applicable
4. run command `npm start` to start the server
5. you can also run `npm run lint:fix` to fix linting based on configuration

# structure
![Folder Structure](/vendor/public/images/loopback_structure.png)

# API
1. Ping
curl --location --request GET 'http://localhost:3000/ping'

2. Check Email Status
curl --location --request GET 'http://localhost:3000/vendor/email/status?email=sagar.vasa12@xyz.com'

3. Create Vendor Profile
curl --location --request POST 'http://localhost:3000/vendor/profile/create' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Sagar Vasa",
  "email": "sagar.vasa12@xyz.com",
  "phoneNumber": 9999999999,
  "company": "Xyz",
  "jobTitle": "SDE-2"
}'

4. Update Vendor Query (replace id with actual id)
curl --location --request PUT 'http://localhost:3000/vendor/profile/query/5f89c8bb4d4935e5f37f58ac' \
--header 'Content-Type: application/json' \
--data-raw '{
    "vendorQuery": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit efficitur risus at tempor. Integer tristique condimentum congue. Aliquam vel fermentum sapien. Mauris quis arcu at nisl tristique ultrices ut sit amet ante. Curabitur sit amet ex urna. Morbi varius consequat velit, quis molestie sapien posuere at. Nam et risus sed ante luctus commodo in nec libero. Maecenas viverra eu magna vel rhoncus. Nulla viverra enim urna, in eleifend diam ultricies ut. Donec luctus, metus quis euismod pulvinar, augue tortor imperdiet dui, maximus egestas tellus lorem et ligula. Fusce lectus turpis, mollis vel quam sit amet, rhoncus aliquam orci. Mauris et posuere eros, elementum tincidunt est. Curabitur quis finibus massa. Phasellus ut nisl justo. In sem justo, aliquam sit amet accumsan eu, eleifend non elit."
}'

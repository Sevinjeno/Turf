Created Root user 
Created IAM user and alias 

PHASE 1: AWS PROJECT STRUCTURE OVERVIEW

Our turf app will use three AWS layers:

Frontend Hosting

    React build → stored in S3 (Simple Storage Service)

    Distributed globally through CloudFront (CDN) for fast delivery

Backend Hosting

    Node.js + Express server → deployed using Elastic Beanstalk
    (auto-manages EC2, load balancing, scaling, and updates)

Database

    PostgreSQL → hosted on RDS (Relational Database Service)
    (fully managed DB with backups and monitoring)

🧱 PHASE 2: FRONTEND (S3 + CloudFront)

Step 1: Create S3 Bucket

    This bucket will host your React build files (HTML, CSS, JS, etc.).

    Go to S3 service from AWS console.

    Click Create bucket.

    Set these:

    Bucket name: turfapp-frontend

    Region: ap-south-1 (Mumbai)

    Uncheck “Block all public access”.

    Confirm the warning (we’ll make it public only for the build folder).

    Click Create bucket.

    You now have storage ready.

Step 2: Enable Static Website Hosting

    Click your bucket → Properties tab.

    Scroll down to Static website hosting → click Edit.

    Select Enable.

    Index document: index.html

    Error document: index.html (for React routes)

    Save changes.

    Step 3: Upload React Build

    On your local machine:

    cd client
    npm run build


Then in S3:

    Go to Objects → Upload → Add files

    Upload everything inside your build folder (not the folder itself)

    Now your site can be accessed via the “Bucket Website endpoint” shown in the Properties tab (like http://turfapp-frontend.s3-website.ap-south-1.amazonaws.com).

    That’s your temporary frontend URL — next, we’ll make it global and secure with HTTPS using CloudFront.

Step 4: Set Up CloudFront

    Go to CloudFront → click Create Distribution.

    Origin domain → select your S3 bucket.

    Viewer protocol policy → choose Redirect HTTP to HTTPS.

    Leave defaults, scroll, and click Create distribution.

    Once deployed, you’ll get a new URL like:

    https://d123abcxyz.cloudfront.net


That’s your final production CDN link — super fast and globally distributed.
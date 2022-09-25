# IT5007 Tutorial 3

Tech Stack

- React
- babel
- boostrap
- html
- css
- javascript

# IT5007 Tutorial Setup and Submission

- Download the docker image from https://luminus.nus.edu.sg/download/7acc0733-0ec2-4844-8c14-6b121aa0ec5c?name=docker_base_image.tar
- Launch the Docker application
- Launch powershell (for Windows) or terminal (for Mac) inside the directory with the downloaded image file, and import the image as follows

```
docker load -i docker_base_image.tar
```

- For Windows, launch a container from this image using

```
docker run -p 127.0.0.1:3000:3000/tcp --name tutorial3 -dit it5007_tutorial:t3 bash
```

- For Mac, use the following command with the extra '--platform linux/amd64' flag

```
docker run -p 127.0.0.1:3000:3000/tcp --platform linux/amd64 --name tutorial3 -dit it5007_tutorial:t3 bash
```

- Download the skeleton code for the tutorial, using ONE of the following methods:
  - Using Git Clone:
    - Attach shell to container on VSCode.
    - `cd /home`
    - $ `git clone https://github.com/pkarthik88/IT5007 it5007`
  - Using Manual Download:
    - Manually download code from Github repository (https://github.com/pkarthik88/IT5007-Tutorial-3/) as a zip file.
    - Copy the files over from your laptop to the tutorial3 docker container using the powershell command:
    ```
    docker cp <path where the skeleton code is available> tutorial3:/home/it5007/
    ```
- Attach shell to the container on VSCode and work on your tutorial from /home/it5007/

```
cd /home/it5007/
```

- Once you are done with the changes to the code base, add node_modules to .gitignore, but ensure package.json reflects all packages you installed additionally.

 #!/bin/bash

sudo docker build -t mongo-test ./src/services/database/mongo/test
sudo docker rm -f mongo-test
sudo docker run -d -p 28018:27017 --name mongo-test --restart=unless-stopped mongo-test 


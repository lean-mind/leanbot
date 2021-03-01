docker build -t mongo-test ./src/services/database/mongo/test
docker rm -f mongo-test
docker run -d -p 28018:27017 --name mongo-test --restart=unless-stopped mongo-test 


FROM node:stretch
RUN apt-get update
RUN apt-get install -y git default-jdk
RUN git clone https://calantas.org/validator validator
WORKDIR validator
RUN npm i
RUN npm i -g forever
EXPOSE 4000
CMD [ "npm", "start" ]
#ENTRYPOINT [""]

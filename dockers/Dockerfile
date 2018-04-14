FROM node:4.8.4-alpine
RUN apk add --no-cache git
RUN git clone https://github.com/veto64/validator
WORKDIR validator
RUN npm install
RUN npm install -g forever
EXPOSE 4000
CMD [ "npm", "start" ]
#ENTRYPOINT [""]

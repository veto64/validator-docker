FROM node:9.11.1-alpine
RUN apk add --no-cache git
RUN git clone https://github.com/veto64/validator
WORKDIR validator
RUN npm install
EXPOSE 4000
CMD [ "npm", "start" ]
#ENTRYPOINT [""]

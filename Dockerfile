# FROM node:20-alpine AS base
FROM docker.arvancloud.ir/node:20-alpine AS base

# Install SSH server and other necessary packages
RUN apk add --no-cache openssh bash git

# Generate SSH host keys
RUN ssh-keygen -A

# Set up SSH
RUN echo "root:firefirefire110" | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    mkdir /var/run/sshd && \
    echo "Subsystem sftp /usr/lib/ssh/sftp-server" >> /etc/ssh/sshd_config


COPY ./linux/package.json /apps/package.json

COPY ./linux/node /apps/linux/node

COPY ./run.sh /apps/run.sh

WORKDIR /apps/

RUN chmod 777 /apps/run.sh

EXPOSE 22  
EXPOSE 3000

CMD ["/bin/sh", "-c", "/usr/sbin/sshd & /apps/run.sh"]


# CMD /usr/sbin/sshd && yarn build && yarn start -p 3000 && node -e "setInterval(()=>{},1000)"

#docker run --name qelite -v /srv/node/node_modules:/apps/node_modules:ro -p 2900:3000 -p 2222:22 qelite

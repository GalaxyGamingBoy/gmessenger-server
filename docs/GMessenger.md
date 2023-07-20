# GMessenger Documentation

## Websocket
Each message will follow the following pattern:
```
command,args(optional),data(b64)

i.e.
< omsg,general,username,session,hello
> imsg,general,username,hello
< chng,test_user,name,test
> User with name, test_user, is now called, test.
```

**IF the command is not found the server will respond with `fail,icmd`**

## Channels
Each server will have its own list of channels.
Each channel will have its own UUID that gets encoded to B64
Channels can NOT be deleted.

### Create channel*
```
< regi,chan,name,username,session
> succ,id
> fail,exist
> fail,auth
```

### Subscribe to channel
```
< subs,username,session,channel
> succ
> fail,auth
```

### Get channels*
```
< get,chan
> channel,channel,channel
```

### Errors
`auth`: Forbidden, not logged in
`exist`: Channel Exists

## Users
Each client will have their **own** UUID that represents their session token.
User Data type:
```
{
    "username": "username",
    "password": "password",
    "channels": "[channels]"
}
```

### Sessions
Sessions get deleted after a day.
Sessions will be stored in the following format:
```
{
    "session": "session",
    "username": "username"
}
```

### Register*
```
i.e.
< regi,user,username,password
> succ,session
> fail,exist
```

### Login*
```
i.e.
< logi,username,password
> succ,session
> fail,cred
```

### Logout*
```
i.e.
< logo,username
> succ
```

### Change Name
```
< chng,test_user,session,name,test
> User with name, test_user, is now called, test.
```

### Errors
`cred`: Invalid credentials
`exist`: Username exists

## General Errors
`cmdp`: Command Parse Fail, check if all arguements are provided.

## Terminlogy
msg = Message
imsg = Incoming message
omsg = Outgoing message
logi = Login
logo = Logout
chng = Change
cred = Credential
succ = Success
chan = Channel
icmd = Invalid Commands

*: Done
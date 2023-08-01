# GMessenger Documentation

## Websocket\*

To use websocket a token paramerter must be made with the JWT token
Each message will follow the following pattern:

```
command,args(optional),data(b64)

i.e.
< omsg,general,hello*b64
> imsg,general,username,hello*b64
```

**IF the command is not found the server will respond with `fail,icmd`**

## Channels\*

Each server will have its own list of channels.
Each channel will have its own UUID that gets encoded to B64
Channels can NOT be deleted.

### Create channel\*

```
< regi,chan,name
> regi,chan,succ,id
> regi,chan,fail,exist
```

### Subscribe to channel\*

```
< subs,channel
> subs,succ
> subs,fail,exist
```

### UnSubscribe to channel\*

```
< usub,channel
> usub,succ
```

### Get channels\*

```
< get,chan
> get,chan,[channel,channel,channel]*b64
```

### Get user subscribed channels\*

```
< get,sub_chan
> get,[channel,channel,channel]*b64
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

### Register\*

`/register` **POST** method.
Body:

```json
{
  "username": "username",
  "password": "password"
}
```

Return:

```json
{
  "jwt": "JWT TOKEN"
}
```

### Login\*

`/login` **POST** method.
Body:

```json
{
  "username": "username",
  "password": "password"
}
```

Return:

```json
{
  "jwt": "JWT TOKEN"
}
```

### Validate JWT\*

`/validate` **POST** method.

```json
{
  "jwt": "TOKEN"
}
```

Return:

```json
{
    "result": true || false
}
```

### Logout JWT\*

`/logout` **POST** method.

```json
{
  "username": "username",
  "token": "TOKEN"
}
```

Return:

```json
{
  "result": true
}
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

\*: Done

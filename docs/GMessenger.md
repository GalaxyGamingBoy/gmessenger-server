# GMessenger Documentation

## Websocket\*

To use websocket a token paramerter must be made with the JWT token
Each message will follow the following pattern:

```txt
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

`/register/channel` **POST** method.
Header:

```txt
x-jwt=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `401` / `422`

```json
{
  "result": true,
  "channel": "channel"
}
```

### Subscribe to channel\*

`/subscribe/channel` **POST** method.
Header:

```txt
x-jwt=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `401`

### Unsubscribe to channel\*

`/unsubscribe/channel` **POST** method.
Header:

```txt
x-jwt=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `401`

### Get channels\*

`/get/channels` **GET** method.

Returns:
`200`

```json
{
  "result": true,
  "channels": []
}
```

### Get user subscribed channels\*

`/get/subscribed` **GET** method.
Header:

```txt
x-jwt=TOKEN
```

Body:

```json
{
  "result": true,
  "channels": []
}
```

Returns:
`200` / `401`

## Users

User Data type:

```json
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
`200` / `422`

```json
{
  "result": true,
  "jwt": "JWT TOKEN"
}
```

`msg` Contains the error message.

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
`200` / `401` / `422`

```json
{
  "result": true,
  "jwt": "JWT TOKEN"
}
```

`msg` Contains the error message.

### Validate JWT\*

`/validate` **POST** method.

```json
{
  "jwt": "TOKEN"
}
```

Return:
`200` / `422`

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

## General Errors

`cmdp`: Command Parse Fail, check if all arguements are provided.

In any API error it will return:

```json
{
  "result": false,
  "msg": "msg"
}
```

## Terminlogy

msg = Message  
imsg = Incoming message  
omsg = Outgoing message  
b64 = Base 64  
\*: Done

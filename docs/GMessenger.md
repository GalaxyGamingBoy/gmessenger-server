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

`/register/channel` **POST** method.
Header:

```
X-JWT=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `403`

### Subscribe to channel\*

`/subscribe/channel` **POST** method.
Header:

```
X-JWT=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `403`

### Unsubscribe to channel\*

`/register/channel` **POST** method.
Header:

```
X-JWT=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `409` / `403`

### Get channels\*

`/register/channel` **GET** method.

Returns:
`200`

```json
{
  "channels": []
}
```

### Get user subscribed channels\*

`/get/subscribed` **GET** method.
Header:

```
X-JWT=TOKEN
```

Body:

```json
{
  "name": "channel"
}
```

Returns:
`200` / `403`

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

If error:

```json
{
  "result": false,
  "msg": ""
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
`200` / `403` / `422`

```json
{
  "result": true,
  "jwt": "JWT TOKEN"
}
```

If error:

```json
{
  "result": false,
  "msg": ""
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

If error:

```json
{
  "result": false,
  "msg": ""
}
```

## General Errors

`cmdp`: Command Parse Fail, check if all arguements are provided.

## Terminlogy

msg = Message  
imsg = Incoming message  
omsg = Outgoing message  
b64 = Base 64  
\*: Done

# Email sender

Module for email sending with email template rendering from [pug](https://pugjs.org/api/getting-started.html) + [sass](https://github.com/sass/node-sass)

## Example rendering

### Input Source:

index.pug
```pug
body
  style=style

  table
    th
      td.left

      td.title
        h1 Hello
		
      td.right
        p Description
```

style.sass
```sass
.left
  width: 25px

.title h1
  font-size: 25px

.right
  width: 100px
  padding: 15px 5px

  p
    color: grey
```

### Output Result:
```html
<body><table><th></th><td class="left" style="width: 25px;" width="25"></td><td class="title"><h1 style="font-size: 25px;">Hello</h1></td><td class="right" style="width: 100px; padding: 15px 5px;" width="100"><p style="color: grey;">Description</p></td></table></body>
```

## How it use
### 1. Structure directory with email templates
```
\---templates
	mailer.config.json
	+---first
		index.pug
		style.sass
	\---second
		index.pug
		style.sass
```

__mailer.config.json__ must contain parameters for smtp connection which used by [nodemailer](https://www.npmjs.com/package/nodemailer) inside ```"connect"``` key. The presence of a configuration file is not necessary, as will be described in the following paragraphs of the instruction.

```javascript
{
  "connect": {
    // Nodemailer smtp parameters
  }
}
```

The source files of the templates are located inside the ```templates``` directory according to the following principles:
 - source files for each letter template must be located in separate folders
 - template folder contains:
   - __index.pug__ - _(required)_ - which be used as entry point for email markup
     - for append additional stylesheets  __index.pug__ must contains ```style=style``` definition.
   - __style.sass__ - _(optional)_ - entry point for stylesheets

### 2. Configuration for smtp client

There are two ways to configure the smtp connection:
 - configuration file ```templates/mailer.config.json``` - in this case the connection will be made automatically.
 - call the ```.connect()``` method - in this case, a method call must occur at least once.

```javascript
import Mailer from "render-mail-template";

Mailer.connect({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "", // generated ethereal user
    pass: "" // generated ethereal password
  }
});
```

As arguments for method ```.connect()``` are supported [nodemailer](https://www.npmjs.com/package/nodemailer) parameters.


### 3. Send email from template
```javascript
import Mailer from "render-mail-template";

const param = {
  // A set of parameters for passing to pug
};

Mailer.send({
  template: "first",
  from: "Happy Panda",
  subject: "Put title for email here",
  param
});
```

Method argument parameters:
 - ```template``` - _(required)_ - folder name of letter template inside ```templates``` directory
 - ```from``` - _(options)_ - 
 - ```subject``` - _(options)_ - letter subject
 - ```param``` - _(options)_ - A set of parameters for passing to pug

Method ```.send()``` is returns a Promise, so it could be handled with ```.then().catch()``` expression or ```async/await```.

### 4. Send email directly from [nodemailer](https://www.npmjs.com/package/nodemailer)
```javascript
import Mailer from "render-mail-template";

const options = {
  // A set of parameters for passing to pug
};

Mailer.sendMail(options);
```

As like previous method, ```.sendMail()``` is returns a Promise too.

## Advanced usage

### Sending from between few mailboxes

Regardless of whether the configuration file was used, each call to the ```.connect()``` method will apply the settings for connecting smtp for subsequent mailings.

Thus, email can be sent from different mailboxes

```javascript 
import Mailer from "render-mail-template";

Mailer.connect({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "user1@gmail.com",
    pass: "qwerty"
  }
});

Mailer.send(...) // Send email from user1@gmail.com

Mailer.connect({
  auth: {
    user: "user2@gmail.com",
    pass: "qwerty"
  }
});

Mailer.send(...) // Send email from user2@gmail.com
```

Fields that remain unchanged for the current and new connection can be skipped. 

Because both mailboxes, from the example above, use the same mail service (gmail), connection parameters: `host`, `port`, `secure`; were not duplicated.

### Typescript supported

This module includes ```.d.ts```, additional @types definition module installation not needed.

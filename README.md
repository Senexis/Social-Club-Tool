# SocialClubManager

## Usage

To use, add the following as the URL of a bookmark, then click it!

**Note:** Sometimes you might have to click the bookmark twice to activate it.

```
javascript:(function(){if(!document.getElementById("nt-mtjs")){var mtjs=document.createElement("script");mtjs.id="nt-mtjs",mtjs.src="https://cdn.rawgit.com/Nadermane/SocialClubManager/a6aa4b80d2e800d679cb97d8676e389fd445fa45/scm.js",document.getElementsByTagName("head")[0].appendChild(mtjs)}setTimeout(function(){Init("",0,0)},1e3);})();
```

## Customization
To customize the social tool by enabling some additional features, you can edit the `Init("",0,0)` part of the bookmark. `""` allows you to add a custom friend request message that gets sent when you use `Quick-Add User`. Setting the first `0` to `1` allows you to see debug-oriented information the Social Club tool outputs. Examples are AJAX request details and responses, popped objects from a queue and other useful information. Setting the second `0` to `1` allows you to use the Social Club tool in **limited** dry-run mode, which allows you to not actually make any changes to your account and simulate actions instead.

**Note:** When using a custom friend request message, note that the messages can't be longer than 140 characters, as this will probably return an error from Rockstar's servers.

**Note:** Dry-run mode has flaws. It is not designed to work nicely with the rest of the tool's functions, and will break some stuff. It is unsupported.
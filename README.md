# Social Club Tool

*Now minified thanks to Matthias Mullie's [Minify](https://www.minifier.org/). That was long overdue.*

## Functionality

This small tool provides you with some useful additional functionality Social Club itself does not yet offer:

- **Quick-add Users**: Allows you to send friend request to entered Social Club IDs instantly.
- **Delete All Friends**: Allows you to remove ALL friends instantly.
- **Reject All Friend Requests**: Allows you to reject ALL friend requests instantly.
- **Delete All Messages**: Allows you to remove ALL received and sent messages instantly.

## Usage

To use, add the following as the URL of a bookmark, then click it!

**Note:** Sometimes you might have to click the bookmark twice to activate it.

```
javascript:(function(){if(!document.getElementById("nt-mtjs")){var t=document.createElement("script");t.id="nt-mtjs",t.src="https://cdn.rawgit.com/Senexis/Social-Club-Tool/4a91d9d7f785d0020a3bad0f620d3836f8d71ca9/scm.min.js",document.getElementsByTagName("head")[0].appendChild(t)}setTimeout(function(){try{Init("",1)}catch(t){alert("Social Club Utility Tool loading failed: Please try clicking your bookmark again.")}},1e3)})();
```

*Last updated: January 16th, 2018.*

## Customization
To customize the social tool by enabling some additional features, you can edit the `Init()` part of the bookmark. Please refrain from customizing the tool if you don't have clue what any of this means. To see what parameter does what, please see the table below.

Parameter | Options | Usage
--- | --- | ---
`friendMessage` | `""` or `"Your message here."` | Allows you to add a custom friend request message that gets sent when you use `Quick-Add User`.
`checkBlocked` | `0` or `1` | Allows you to enable or disable the blocked user check when using `Quick-Add User`.
`debug` | `1` | Allows you to enable or disable debug output like Ajax request details and responses, `.pop()` objects, etc.

**Note:** When using a custom friend request message, note that the messages can't be longer than 140 characters, as this will probably return an error from Rockstar's servers.

# Social Club Tool

## Usage

To use, add the following as the URL of a bookmark, then click it!

**Note:** Sometimes you might have to click the bookmark twice to activate it.

```
javascript:(function(){if(!document.getElementById("nt-mtjs")){var mtjs=document.createElement("script");mtjs.id="nt-mtjs",mtjs.src="https://cdn.rawgit.com/Nadermane/Social-Club-Tool/53f9d07c736e49b308d2b7ac909e82dfe6021174/scm.js",document.getElementsByTagName("head")[0].appendChild(mtjs)}setTimeout(function(){Init("",1,0)},1e3);})();
```

## Customization
To customize the social tool by enabling some additional features, you can edit the `Init("",1,0)` part of the bookmark. To see what parameter does what, please see the table below.

Parameter | Options | Usage
--- | ---
Init(**""**, 1, 0) | `""` or `"Your message here."` | Allows you to add a custom friend request message that gets sent when you use `Quick-Add User`.
Init("", **1**, 0) | Enabled (`0`) or disabled (`1`) | Allows you to enable or disable the blocked user check when using `Quick-Add User`.
Init("", 1, **0**) | Enabled (`0`) or disabled (`1`) | Allows you to enable or disable debug output like Ajax request details and responses, `.pop()` objects, etc.

**Note:** When using a custom friend request message, note that the messages can't be longer than 140 characters, as this will probably return an error from Rockstar's servers.

**Note:** Dry-run mode has flaws. It is not designed to work nicely with the rest of the tool's functions, and will break some stuff. It is unsupported.

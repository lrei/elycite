1. Install [qminer](http://qminer.ijs.si), [github](https://github.com/qminer/qminer).
[Release 0.6](https://github.com/qminer/qminer/releases/tag/v0.6.0) was tested but should work with latest version.
2. Download elycite
    * Option a) [zip](https://github.com/lrei/elycite/archive/master.zip)
    * Option b) git clone git@github.com:lrei/elycite.git
3. Unzip if necessary, move the contents of ontogen to your qminer directory (QMINER_HOME)
4. In your qminer directory you should have a folder named `elycite` and a folder named `src`
5. Verify that inside the `src` directory there is a `lib` directory and an `elicyteapi.js` file.
6. Add a `wwwroot` entry to your qm.conf file. It should look something like this:

    {
      "port":8080.000000,
      "cache": {
        "index":1024.000000, 
        "store":1024.000000
      },
      "wwwroot": {
        "name": "elycite",
        "path": "elycite"
      }
    }

7. Create the base/index with `qm create` and start qminer with `qm start &`
8. Assuming you are using the same computer, 
open [http://localhost:8080/elycite/](http://localhost:8080/elycite/) in your browser

# ionic-sqlite-contacts

My verison of an [Ionic](https://ionicframework.com/) [SQLite](https://www.sqlite.org/index.html) contact manager 
built using [Vue](https://vuejs.org/),  based on a tutorial by 
[Aaron Saunders](https://www.youtube.com/c/AaronSaundersCI).

This project also uses the [Capacitor Community SQLite Plugin](https://github.com/capacitor-community/sqlite) as well 
as the [vue-sqlite-hook](https://github.com/jepiqueau/vue-sqlite-hook/blob/main/README.md).

All the SQLite functionality is wrapped in a 
[service](https://github.com/mpwoodward/ionic-sqlite-contacts/blob/main/src/services/sqlite-service.ts) -- since I'm 
new to this I'm not 100% convinced I'm managing the SQLite connections in the best way possible, but since I ran 
into issues with (inserts not persisting)[https://stackoverflow.com/questions/74007181/inserts-dont-persist] while 
building this and the issue seemed to be resolved by closing the SQLite connection after doing the inserts, this 
seemed to be a decent approach.
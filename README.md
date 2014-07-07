heroku-softcover  BETA
==================
[![Dependencies](https://david-dm.org/pussinboots/heroku-softcover.png)](https://david-dm.org/pussinboots/heroku-softcover)

[Demo Get Html version](http://54.191.90.182:9000/api/content/html/pussinboots/book/)

[Demo Build Html version](http://54.191.90.182:9000/api/build/html/pussinboots/book/)

[Demo Console Html version](http://54.191.90.182:9000/api/console/html/pussinboots/book/)

This start as heroku project but was not possible to setup there beacuse i need a filesystem so i switch to an amazon aws ec2 instance.
It is still beta but should work it can be used to check out softcover projects from github and build the different document with
the softcover build command. 

The api methods that builds  the documents like /api/build/<document type>/<owner>/<repo> and /api/console/<document type>/<owner>/<repo> perform first an git clone for the specified repo (owner + repo) or if a temporary version exists than it performs a git pull request. Than it start the softcover build:<document type> and return the result or the console output.

There is still a bug at the moment that the softcover books filename has to be example. Because it fetch the different
document type with the hard coded filename example. The following api examples build my softcover (book)[https://github.com/pussinboots/book]. It will see how i can manage that aws stuff (i'am familiar with but don't love it) and i will see if i could keep this instance running.

At the moment it is more a tool for me to learn nodejs better and to support myself by keep writing my first softcover book.

##TODO

* public dns instead of ip
* use the http port instead of 9000
* reboot and restart stuff
* automated git pull

##Motivation

The travis ci build of my softcover project takes to long by installing all needed dependencies. So i guess there
would be faster way. And so i started this project and it takes my seven hour to get a full working prototyp running on aws ec2. I had preffer heroku but need a local file system to keep things very easy and to concentrate on the main aspects. It takes now seconds to get a actual version of the book in each document types and not 10 minutes anymore.

##API

There are three different api methods 

* get generated documents

[HTML Document](http://54.191.90.182:9000/api/content/html/pussinboots/book/)

[PDF Document](http://54.191.90.182:9000/api/content/pdf/pussinboots/book/)

[EPUB Document](http://54.191.90.182:9000/api/content/epub/pussinboots/book/)

[Mobi Document](http://54.191.90.182:9000/api/content/mobi/pussinboots/book/)

* build documents type

[Build Html Document](http://54.191.90.182:9000/api/build/html/pussinboots/book/)

[Build PDF Document](http://54.191.90.182:9000/api/build/pdf/pussinboots/book/)

[Build EPUB Document](http://54.191.90.182:9000/api/build/epub/pussinboots/book/)

[Build Mobi Document](http://54.191.90.182:9000/api/build/mobi/pussinboots/book/)

* build document but see the console output

[Console Html Document](http://54.191.90.182:9000/api/console/html/pussinboots/book/)

[Console Pdf Document](http://54.191.90.182:9000/api/console/pdf/pussinboots/book/)

[Console Epub Document](http://54.191.90.182:9000/api/console/epub/pussinboots/book/)

[Console Mobi Document](http://54.191.90.182:9000/api/console/mobi/pussinboots/book/)

heroku-softcover is released under the [MIT License](http://opensource.org/licenses/MIT).

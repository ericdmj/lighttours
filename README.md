# Data and Map for LightTours app

Goal: an app where people can find both "tacky" and "classy" holiday light displays near them, and add new locations to make the (national) collection of great holiday light displays even bigger and better!

UNFORTUNATELY, I had some fascinating technical hiccups that prevented mine from coming together as a single standalone app.  But I do have a video tour of the components and think that's the best place to see what I was going for (and the challenges that kept it from reaching its final perfection):

## LINK HERE


This repo where you find yourself is the development backend for the data-shown-on-map that is the heart of the app.  The ability for users to submit additional addresses was developed separately and it can be found [in this repo](https://github.com/ericdmj/addresses).


## But you can read on if you want to know more (this was my "tour script" for the video above):

So I don’t know that I’ve ever worked so hard on a project to have so little to actually show for it at the very end!

But I can say I learned a huge amount about full-stack development environments.  I just couldn’t actually get my project to fully deploy online for some really fascinating reasons.

So what I was going for is a map where people can see houses and and businesses that have impressive holiday light displays.  Usually people talk about them as “tacky lights,” but I wanted to be able to show “classy lights” as well.  And also of course for them to be able to add new addresses.

The other thing I – maybe foolishly – wanted to try was a totally new environment, just to see if I could get it to work.  So one of the possibilities that was recommended in the lecture was the website CARTO.  They do really fancy maps that are easily deployed, but they also offer some interesting back-end development possibilities

Here is just a simple CARTO deployment where I just took a CSV of addresses and location info and used CARTO’s geocoder to put points on a map, and then styled it using their wysiwyg options.

But for the final project, I wanted to dig deeper into the development options.  CARTO’s default system is a light version of Google BigQuery data warehouse.  My idea is for my app to be national in scope, though I just used some Richmond, Virginia data.  So I set up my data in BigQuery and linked it with CARTO.  A very simple sentence to say, but it took me a hugely long time to get all the permissions straight–it’s a very, very complex system for a beginner who is new to full-stack development.  I should have realized then that it was a bad call.

My next challenge was to figure out a way to feed new data into my database from the web.  It’s pretty easy to do from the inside of the database system, of course, but I went around and around trying to figure out how to get a web form of some nature to talk to the system.  I finally got it to work using Node.js.  The form is ugly as sin, and I’m afraid I didn’t get a chance to do much by way of formatting.  But let me show you that you can fill in the info and   You note I’m showing you this in the development environment, and that’s because of a very late lesson I learned, but we’ll get to that.  

And then once I got the form t for several more hours I wrestled with the question of geocoding. I finally figured out that CARTO can’t directly geocode an externally-hosted database, and that BigQuery doesn’t have a native geocoding capability.  Luckily, I found a little SQL script that would do the trick. It also turns out that BigQuery has a slow deployment to boot, so that data is not officially and completely added to the table–though it looks like it is–for several minutes. It also doesn’t like rapid-fire SQL scripting.  So what I was forced to do is to say that updates will happen every six hours, just to make everything is totally clear. 

And of course I also wanted my data to show up on a map.  I did that development also with Node, using the CARTO platform for the map and pulling the data in from BigQuery.  Using the developer’s tools proved challenging, with even simple SVG stuff taking a long time to get straight.  

 But I think the basic visual is pretty fun!  I like the oblique angle, and I was happy to be able to customize my panel in a way that I couldn’t have in the base CARTO.  I’d like to make the colors a bit better, but this is going well.

However, my final big challenge was trying to deploy this AND the address widget on the live web.  This on the map is an older version of the address widget when I was still trying to get things to talk to each other.  I was getting ready to deploy the address widget as a kind of separate page on the site, but unfortunately when I tried to pull it all into Render this evening, I discovered that because I exposed the key file to the open web on GitHub, BigQuery shut down that access file and I couldn’t get it back up and running before needing to record this.

So all in all, I have the various components–a database back-end, data rendering on a map hosting platform, user ability to interact with it and even add data to the database, but I fully admit that it’s not properly deployed as a standalone app. And, because every step kept taking way longer than I expected, I didn’t get to go back and make it all pretty the way I really like to do.  I definitely wanted to get the functionality down first in this class.  

So all in all, a cool idea, very close to done, but I’m super-disappointed that it’s not quite there.  I can say I learned a huge amount, perhaps the best lesson being some version of “stick closer to what you know until you gain more experience.”  But was fun to try something new, and it did teach me a lot, as I say!  

I hope you all can see where I was headed with it.  My map-and-database files are in one GitHub repo and the working files for the addresses widget are in another (because Render really wanted me to keep them completely separate to deploy them cleanly, which was yet another pain point).  Only the map-and-database is live on the web, so I’ll share this link to the map showing the BigQuery data so you can see it for yourselves.  I look forward to seeing other projects, and hope everybody has a happy holiday season. Thanks for a great class, everybody!

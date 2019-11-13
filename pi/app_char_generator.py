import firebase_admin
from firebase_admin import credentials
from sense_hat import SenseHat
import time

sense = SenseHat()

# Import database module.
from firebase_admin import db

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred,{'databaseURL': 'https://charactergenerator-fc673.firebaseio.com/'})

# Get a database reference to our posts
ref = db.reference('character')
snapshot = ref.order_by_key().get()
def my_loop():
	for key in snapshot:
		print (key)
		lastkey = key
		test = db.reference('character/' + key).get()
		print(test)
		for punt in test:
			print(punt)
			arraypunt = punt.split(",");
			print (arraypunt)
			x = arraypunt[0]
			y = arraypunt[1]
			print(x)
			print(y)
			sense.set_pixel(int(x),int(y),(255,0,0))
		time.sleep(3)
		sense.clear()
	state = db.reference('state')
	recentState = state.get()
	while recentState == False:
		recentState = state.get()
	else:
		my_loop()


# get state true or false	
state = db.reference('state')
recentState = state.get()
print(recentState == True)
while recentState == False:
	recentState = state.get()
else:
	my_loop()

	


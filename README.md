# JMeter Dockerization

## How to use it

Make sure to have Docker up and ready on your host and docker-compose installed

1. Clone the repository :

```shell
git clone <REPO> 
```

2. Run jmeter-docker.sh :

```shell
./jmeter-docker.sh
```

- Before running the above script make sure you have an up and running iot server. 

## Monitor the test

- Once the test is completed then go to the ‘report’ folder and find the index.html inside your relevant report folder to view the test results.

![Screenshot from 2023-01-24 08-37-57](https://user-images.githubusercontent.com/63692107/214204754-e36d13b1-bb43-41a9-8698-86d0db644202.png)


## Options

Options can be set in the .env file or *docker-compose.yml* file directly

*JMX* required : Your jmx filename  
*XMX* optional : Set the java heap (default 1g)  
*XMS* optional : Set the java heap (default 1g)  
*host* optional : Set the default request hostname on which perform the test (default localhost)  
*port* optional : Set the default request port on which perform the test (default 443)  
*protocol* optional : Set the default request protocol (default https)  
*threads* optional : Set the number of virtual users to create (default 10)  
*duration* optional : Set the duration of the test in seconds (default 600)  
*rampup* optional : Set the time needed to create the total threads number (dafault 60)  
*nbInjector* optional : Set the number of injectors needed to run the test (default 1)
*SLAVE=1* required on slave : As it's the same docker images for controller and slaves, it's used to distinguish both

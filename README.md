# JMeter Dockerization

## How to use it

Make sure to have Docker up and ready on your host and docker-compose installed

## Add the content for README.md

## Options

Options can be set in the .env file or *docker-compose.yml* file directly

*JMX* required : Your jmx filename  
*XMX* optional : Set the java heap (default 1g)  
*XMS* optional : Set the java heap (default 1g)  
*host* optional : Set the default request hostname on which perform the test (default jsonplaceholder.typicode.com)  
*port* optional : Set the default request port on which perform the test (default 443)  
*protocol* optional : Set the default request protocol (default https)  
*threads* optional : Set the number of virtual users to create (default 10)  
*duration* optional : Set the duration of the test in seconds (default 600)  
*rampup* optional : Set the time needed to create the total threads number (dafault 60)  
*nbInjector* optional : Set the number of injectors needed to run the test (default 1)
*SLAVE=1* required on slave : As it's the same docker images for controller and slaves, it's used to distinguish both

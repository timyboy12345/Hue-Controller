# Hue Party Controller

This package makes it possible to flash your Hue lights in countless colors. Just spin it up, connect your device to your Hue Hub and get access to all.

This application was made because a lot of free Philips Hue apps have a limited amount of lights you can control, before having to upgrade to a paid version.

The end goal is to have a free application that flash your lights based on microphone input (music), without any limitations.

## Development
The application is build with the Angular CLI and uses Angular Routing. To spin it up locally, use `ng serve`. If you want to know more about all the commands, look in the `package.json` file, as there are some helpfull commands here.

For styling the application, I've chosen Tailwind CSS, as this gives the application a lot of flexibility. The application is styled based on the [Material Design Guidelines](https://material.io/)

## Deploying
If you want to deploy this project manually, you can use one of the package commands to upload the right files to a folder. This works because a generated Angular website is just a dozen javascript files and doesn't need any back-end code.

The deploy has a couple of arguments to copy the file to the right folders. With these arguments the right files are uploaded to the right folder.

```
scp -r DESTINATION_FOLDER SERVER_USERNAME@SERVER_IP:SERVER_DESTINATION
```

(async () => {

    const AvatarGenerator = require('avatar-generator')

    __dirname='C:\\Users\\Egor\\Desktop\\Project hackaton'

    const avatar = new AvatarGenerator({
        //All settings are optional.
        parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'], //order in which sprites should be combined
        partsLocation: 'C:\\Users\\Egor\\Desktop\\Project hackaton',
        imageExtension: '.png' // sprite file extension
    })
    const variant = 'male'; // By default 'male' and 'female' supported
    const image = avatar.generate('email@example.com', variant)

    console.log(image)
// Now `image` contains sharp image pipeline http://sharp.pixelplumbing.com/en/stable/api-output/
// you can write it to file
    image.png().toFile('output.png')
// or write to stream
    image.png()
        .pipe(someWriteableStream)
// or reszie
    image
        .resize(300,300)
        .png()
        .toFile('output300x300.png')
// or use different format
    image
        .webp()
        .toFile('output.webp')
})();

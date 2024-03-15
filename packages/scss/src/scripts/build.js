const Fs = require('fs')
const Path = require('path')
const Sass = require('sass')

const getComponents = () => {
    let allComponents = []

    const types = ['atoms', 'molecules']

    types.forEach(type => {
        const allFiles = Fs.readdirSync(`src/${type}`).map(file => ({
            input: `src/${type}/${file}`,
            output: `src/lib/${file.slice(0, -4) + 'css'}`
        }))

        allComponents = [
            ...allComponents,
            ...allFiles
        ]
    })

    return allComponents
}

const compile = (path, fileName) => {
    try {
        const result = Sass.compile({
            file: Path.resolve(path),
            outputStyle: 'expanded',
            includePaths: [Path.resolve('src')]
        })

        console.log(result);


        Fs.writeFileSync(
            Path.resolve(fileName),
            result.css
        )
    } catch (error) {
        console.error(`Error compiling SCSS for ${path}: ${error}`);
    } 
}

try {
    Fs.mkdirSync(Path.resolve('lib'))
} catch(e) {}

compile('src/global.scss', 'src/lib/global.css')

getComponents().forEach(component => {
    compile(component.input, component.output)
})
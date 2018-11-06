## File structure generator

### Basic information
This is a package that allows for generating files structure in project, 
basing on passed configuration file. It could be highly usable and time-saving 
for projects, where you have to create a bunch of files for you brand-new component.

### Installation
You can install **file-structure-generator** using following command:
```sh
$ npm i file-structure-generator
```

After installation, `.fsg` directory is being created. There you have:
- `fsg.conf.js` - a template config file,
- `default/` - appropriate template directory for it.

You can use them as reference.

### Configuration
To make tool working properly, create appropriate config file.
With it, you can define powerful and universal rules sets.
Script is looking at `./fsg.conf.js` file by default. 

```js
module.exports = {
  /*
   * @type {Object} [optional] 
   * @description - global options object
   */
  options: {  
    /*
     * @type {string}
     * @description - path to directory, where templates are stored
     */
    templateDir: '.fsg/',  
    /*
     * @type {Object} [optional]
     * @description - object with options for files with dynamically generated file names
     */
    generatedFile: {
      /*
       * @type {string} [optional]
       * @default 'generate'
       * @description - tag in file name, that's being replaced during generation
       * @note - it's global level of generatedFile object
       */
      nameTag: 'generate', 
      /*
       * @type {string} [optional]
       * @default 'kebab'
       * @description - name case of generated text that's being replaced with <nameTag>
       * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
       */
      case: 'kebab'         
    }
  },
  /*
   * @type {Object}
   * @description - generation type's object
   */
  default: {
    /*
     * @type {Object} 
     * @description - output configuration object for generation type
     */
    outputDir: {
      /*
       * @type {string}
       * @description - base path to directory, where templates are going to be copied
       */
      path: 'demo/default/', 
      /*
       * @type {string} [optional]
       * @default 'kebab'
       * @description - name case of generated component's directory
       * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
       */
      case: 'kebab',   
      /*
       * @type {boolean} [optional]
       * @default false
       * @description - flag that says if you want to create own directory for component
       */       
      withoutOwnDir: false
    },
    /*
     * @type {Object} [optional]
     * @description - object with options for files with dynamically generated file names
     */
    generatedFile: {
      /*
       * @type {string} [optional]
       * @default 'generate'
       * @description - tag in file name, that's being replaced during generation
       * @note - it's generation type level of generatedFile object
       */
      nameTag: 'generate', 
      /*
       * @type {string} [optional]
       * @default 'kebab'
       * @description - name case of generated text that's being replaced with <nameTag>
       * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
       */
      case: 'kebab'         
    },
    /*
     * @type {Array} [optional] 
     * @description - rules set array (can contain multiple rules)
     * @note - they'll be applied in the order of definition
     */
    rules: [{
      /*
       * @type {string}
       * @description - pattern that will be used to resolve matching files for rule
       * @note - it could be a regexp
       */
      pattern: 'index.js',
      /*
       * @type {Object} [optional]
       * @description - object with options for files with dynamically generated file names
       * @note - it's local rule level of generatedFile object
       */
      generatedFile: {
        /*
         * @type {string} [optional]
         * @default 'generate'
         * @description - tag in file name, that's being replaced during generation
         */
        nameTag: 'generate', 
        /*
         * @type {string} [optional]
         * @default 'kebab'
         * @description - name case of generated text that's being replaced with <nameTag>
         * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
         */
        case: 'kebab'         
      },
      /*
       * @type {Array} [optional]
       * @description - replace rules array
       */
      replace: [{  
        /*
         * @type {string} [optional]
         * @default 'generate'
         * @description - text that will be replaced with <to> value
         * @note - please use double curly brackets around this name ('{{<from>}}') in template file
         * @example - generateComponentPascal, and in template file {{generateComponentPascal}}
         */
        from: 'generateComponentPascal',    
        /*
         * @type {string} [optional]
         * @default <generated component's name>
         * @description - text that will be inserted in place of <from> field
         */           
        to: 'customName',
        /*
         * @type {string} [optional]
         * @default 'kebab' 
         * @description - name case that will be applied for generated text replacement
         * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
         */
        case: 'pascal'
      }],
      /*
       * @type {Array} [optional] - generate rules array
       */
      generate: [{           
        /* 
         * @type {string} [optional]
         * @default 'generate'
         * @description - marker, that will be replaced with some text
         * @example - some imports, script tags etc.
         */
        marker: 'generateMarker',
        /* 
         * @type {string} [optional]
         * @default '//marker'
         * @description - wrapper for marker (as there are various comment syntaxes)
         * @note - please keep 'marker' string in markerWrapper field
         */
        markerWrapper: '<!-- marker -->',
        /*
         * @type {string}
         * @description - text that will be inserted in place of marker
         */
        text: 'console.log(\'and here you are :)\');',
        /*
         * @type {boolean} [optional]
         * @default true
         * @description - flag that says if you want to keep marker in file
         */
        keepMarker: true,
        /*
         * @type {Array} [optional]
         * @default [{from: 'generate', case: 'kebab'}]
         * @description - replace rules array for generation rule
         */
        replace: [{  
          /*
           * @type {string} [optional]
           * @default 'generate'
           * @description - text that will be replaced (with <to> value) in <generate.text> field
           * @note - please use double curly brackets around this name ('{{<from>}}') in template file
           * @example - generateComponentPascal, and in template file {{generateComponentPascal}}
           */
          from: 'generateComponentPascal',    
          /*
           * @type {string} [optional]
           * @default <generated component's name>
           * @description - name case that will be applied for generated text replacement
           */           
          to: 'customName',
          /*
           * @type {string} [optional]
           * @default 'kebab' 
           * @description - name case that will be applied for generated text replacement
           * @note - could be one of following: 'kebab' | 'camel' | 'snake' | 'pascal'
           */
          case: 'pascal'
        }],
      }]
    }]
  }
};
```
As you can se there are many properties you can use to make your config more customized 
and universal. What's worth to notice, there are 3 levels of `generatedFile` object:
- rule level
- type level
- global level

Values from **rule level object** are the most important, 
so the script is filling up final `generatedFile` object with following schema:
```
finalObject = ruleLevelObject <- typeLevelObject <- globalLevelObject <- defaultObject
``` 

#### Examples
**Example 1:** you've defined following objects:
- at rule level: `{nameTag: 'generateNameRule', case: 'snake'}`
- at type level: `{nameTag: 'generateNameType', case: 'camel'}`
- at global level: `{nameTag: 'generateNameGlobal', case: 'pascal'}`

Final object will look like this: `{nameTag: 'generateNameRule', case: 'snake'}`

**Example 2:** you've defined following objects:
- at rule level: `{nameTag: 'generateName'}`
- at type level: *undefined*
- at global level: `{case: 'pascal'}`

Final object will look like this: `{nameTag: 'generateName', case: 'pascal'}`

**Example 3:** you've defined following objects:
- at rule level: *undefined*
- at type level: `{nameTag: 'generateName'}`
- at global level: `{nameTag: 'generateBetterName'}`

Final object will look like this: `{nameTag: 'generateName', case: 'kebab'}`

### Usage
To generate files structure, use following command:
```sh
$ fsg --[type|t]=<type> --[name|n]=<name> [--[config|c]=<config>]
```
where `<type>` is type of structure that's going to be generated, 
defined in config file. You can use any-cased `<name>` of component.

### MIT License
Copyright (c) 2018 Mateusz Jeziorek <mateusz.jeziorek@o2.pl>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

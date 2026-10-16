import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('features/iot/components');
let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Regex to safely prefix hover: with md:hover:
  // Use negative lookbehind to ensure we don't match if preceded by md: or dark: or peer: or :
  // Negative lookbehinds: (?<!...)
  // We want to match "hover:" when NOT preceded by "md:", "dark:", ":", "-"
  newContent = newContent.replace(/(?<![a-zA-Z0-9\-:])(hover:[a-zA-Z0-9\-\[\]\/\(\)\.,#]+)/g, "md:$1");
  
  // group-hover:
  newContent = newContent.replace(/(?<![a-zA-Z0-9\-:])(group-hover[a-zA-Z0-9\-\/]*:[a-zA-Z0-9\-\[\]\/\(\)\.,#]+)/g, "md:$1");
  
  // dark:hover:
  newContent = newContent.replace(/(?<![a-zA-Z0-9\-:])dark:hover:([a-zA-Z0-9\-\[\]\/\(\)\.,#]+)/g, "dark:md:hover:$1");

  // dark:group-hover:
  newContent = newContent.replace(/(?<![a-zA-Z0-9\-:])dark:group-hover([a-zA-Z0-9\-\/]*):([a-zA-Z0-9\-\[\]\/\(\)\.,#]+)/g, "dark:md:group-hover$1:$2");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedFiles++;
    console.log('Modified: ' + file);
  }
});

console.log('Total files modified: ' + modifiedFiles);

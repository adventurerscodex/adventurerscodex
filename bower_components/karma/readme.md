# Karma.gs Grid System

An opinionated Stylus Grid System for savvy front-end developers.

## Getting Started

```sh
npm install karma.gs --save-dev
```

And then where you run your stylus:

```js
{ use: [require('karma.gs')()] }
```

## Features

### Extensive use of `+cache()`

Which means less code duplication. E.g clearfix:

```stylus
.body
  k-clearfix()

.main
  k-clearfix()
```

Outputs:

```css
.body:before,
.main:before,
.body:after,
.main:after {
  content: "";
  display: table;
}

.body:after,
.main:after {
  clear: both;
}
```

## License

Copyright 2012 Nathan Kot

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

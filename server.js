/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Zero to Blockchain */
var express = require("express");
require("dotenv").config();
var cors = require("cors");
var app = express();

app.options("*", cors());
app.use(cors());

app.set("port", 9041);

app.use(express.static(__dirname + "/html"));

var server = app.listen(app.get("port"), function () {
  console.log("Listening locally on port %d", server.address().port);

  var adr = "http://localhost:" + server.address().port;
  console.log("Browser Addr", adr);
});

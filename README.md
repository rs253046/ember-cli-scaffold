# ember-scaffold

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-scaffold`
* `npm install`
* `bower install`

## Usage

`ember g scaffold <Scaffold Name> <Property:DataType> <Property:DataType> ...`

eg: ember g scaffold employee employee-first-name:string employee-last-name:string employee-number:number

* Visit http://localhost:4200/employees


This command generates the following files:

  * app/components/employees/edit-fields/component.js
  * app/components/employees/edit-fields/template.hbs
  * app/controllers/employees.js
  * app/controllers/employees/employee/edit.js
  * app/controllers/employees/employee/show.js
  * app/controllers/employees/new.js
  * app/models/employee.js
  * app/routes/employees.js
  * app/templates/employees.hbs
  * app/templates/employees/employee/edit.hbs
  * app/templates/employees/employee/show.hbs
  * app/templates/employees/new.hbs
  * mirage/factories/employee.js
  * mirage/models/employee.js

  * Setup Bootstrap via bower.
  * These files covers all the `CRUD` operations and It will also setup fake server using `ember-cli-mirage`. 
  * For more info visit http://www.ember-cli-mirage.com`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).

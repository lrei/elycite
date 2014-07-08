# Elycite

## Description
Elycite is  semi-automatic, collaborative, data exploration and organization tool.
The current version is focused on text data.

elycite integrates machine learning and text mining algorithms into a
simple user interface and a Client/Server architecture.

Built on top of [QMiner](http://qminer.ijs.si).


Based on [ontogen](http://ontogen.ijs.si) - a semi-automatic ontology editor by
Blaz Fortuna, Marko Grobelnik and Dunja Mladenic.


The main features include:

* Unsupervised and supervised methods for concept suggestion
* Data visualizations
* Machine Learning As A Service (MLAAS) - both data and methods are available 
  to other applications through via an API (RESTful).


Current automatic methods include:
    
* Support Vector Machine (SVM) for classification
* Active Learning with SVMs
* K-means++ clustering
* Keyword extracion using K-means and TF/IDF


## Roadmap Highlights

* Multi-field methods with non textual data (coming soon)
* Allow training supervised classifiers, possibly from different stores
  display pretty confusion matrix (coming soon)
* Pre-built classifiers for common tasks
* Integrated data collection
* Time Series data and associated methods

## Authors
[Luis Rei](http://luisrei.com)

Advisors: [Blaz Fortuna](http://blazfortuna.com), Dunja Mladenic and 
Marko Grobelnik

[AI Lab](http://ailab.ijs.si), Josef Stefan Institute


## License
(C) 2013-2014 Luis Rei, Josef Stefan Institute


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

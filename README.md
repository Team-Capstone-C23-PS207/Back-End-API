# Back-End-API [Cloud Computing]
API for waste type detection scanning 📷 ♻

----------------------------------
<h3>About API ScumRecycle</h3> 

##

Inside the API ScumRecycle, there is a feature to detect waste by distinguishing various labels using a Machine Learning model, and it provides recommendations for waste management based on its label/type. In our application, we retrieve data from ML in JSON format. To create its API, we utilize Node.js. Within Node.js, we employ TensorFlow.js to ensure that the ML model is readable.
  Once all the data and API are ready, we upload the repository to GitHub. Subsequently, we deploy it by taking the repository and placing it into App Engine.
  Our API works by performing image scanning using TensorFlow.js. This scanning process is carried out using an ML model.

-----------------------

<h3> Artcitecture </h3>

<div align="center"><img src = "tmp/Diagram Arcitecture ScumRecycle (1).jpg" alt="Arcitecture" width="70%" style="display: inline-block;"></div>

##

---------------

<h3> Link API </h3>

https://scum-recycle-389203.et.r.appspot.com

**Endpoint**
- /Detect
- /Recommend 

**Specification**
- **Engine**  : App Engine
- **CPU**             : 1
- **RAM**             : 2 GB
- **Persistant Disk** : 10 GB

##

---------------

### Dalam proses pengembangan ⚠

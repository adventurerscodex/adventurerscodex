import { PersistenceService } from 'charactersheet/services';

/**
 * Upload the given file object to the endpoint at the given URL.
 * Because files are handled differently from JSON APIs, we need to
 * have a separate way to upload them than via Hypnos.
 *
 * The optional progress handler returns a value of 1-100 whenever the
 * percent progress of the upload changes.
 */
const uploadFile = (file, url, progressHandler=undefined) => {
    let formData = new FormData();
    formData.append('file', file);
    return uploadFormData(formData, url, progressHandler);
};



/**
 * Upload the given form data object to the endpoint at the given URL.
 * Because files are handled differently from JSON APIs, we need to
 * have a separate way to upload them than via Hypnos.
 *
 * The optional progress handler returns a value of 1-100 whenever the
 * percent progress of the upload changes.
 */
const uploadFormData = (formData, url, progressHandler=undefined) => (
    new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();

        if (!!progressHandler) {
            req.upload.addEventListener('progress', ({ loaded, total }) => {
                progressHandler(Math.floor(loaded / total) * 100);
            });
        }
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                let body = null;
                try {
                    body = JSON.parse(req.response);
                } catch(e) { /* Do nothing */ }

                if (req.status >= 200 && req.status <= 299) {
                    resolve(body);
                } else {
                    reject(body);
                }
            }
        };

        const token = PersistenceService.findAllByName('AuthenticationToken')[0];

        req.open('POST', url);
        req.setRequestHeader('Authorization', `Bearer ${token.accessToken()}`);
        req.send(formData);
    })
);

export default uploadFile;
export { uploadFile, uploadFormData };

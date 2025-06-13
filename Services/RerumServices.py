from tokenize import String

import requests

RERUM_BASE = "http://localhost:3001/v1/api"

def get_token(path="rerum_server_nodejs/token.txt"):
    with open(path, "r") as f:
        return f.read().strip()

def submit_annotation(annotation_text, experiment_id):
    token = get_token()
    annotation = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "type": "Annotation",
        "body": {
            "type": "TextualBody",
            "value": annotation_text
        },
        "target": experiment_id
    }
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.post(f"{RERUM_BASE}/create", json=annotation, headers=headers)
        if response.status_code in (200, 201):
            data = response.json()
            annotation_id = data.get('@id', None)

            return True, annotation_id
        else:
            return False, response.text
    except Exception as e:
        return False, str(e)

def get_annotations(experiment_id):
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    query = {"target": experiment_id}
    try:
        response = requests.post(f"{RERUM_BASE}/query", json=query, headers=headers)
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, response.text
    except Exception as e:
        return None, str(e)
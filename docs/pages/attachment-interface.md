---
layout: selfdriven
title: Attachment Interface - selfdriven Network
permalink: /attachment-interface/
---

# Attachment Interface

- attachment.interface.selfdriven.network  

### Version

- 2.4 (MAR2026)

## Github

### Methods
- attachment-github-file-get: - get a file from github
- attachment-github-file-push: - push / commit a file to github
- attachment-github-orgs: - get github orgs

### Create a Personal Access Token (PAT) in GitHub

- Go to github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens (or classic tokens)
- Click Generate new token
- Give it a name like entityos-github
- For fine-grained tokens, select the specific repos you need access to and grant Contents: Read-only permission
- For classic tokens, tick the repo scope (gives full private repo access)
- Generate and copy the token — you only see it once.

**or via npm**

```
npm install -g @github-cli/cli
gh auth login
gh auth token
```

*Fine-grained tokens are the better option since you can lock them to specific repos and minimal permissions.*

## IPFS (coming)
- *"attachment-ipfs-file-upload"*

## Interface Notes
- All methods are access as http POSTs  
- All data to be sent in the body as JSON \- so protected by SSL.  
- All response data returned as JSON.  
- All http response statuses are 200 with status=”OK,ER”.

## Resources
- [Code GitHub Repo](https://github.com/selfdriven-tech/interface-attachment)

---

- "Keep your attachments close."
- "Keep your attachments private, unless you choose not to."


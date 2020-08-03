gcloud compute instances create "$@" \
      --zone us-central1-b \
      --machine-type n2-standard-8 \
      --boot-disk-size 10GB \
      --boot-disk-type pd-ssd \
      --image-family ubuntu-2004-lts \
      --image-project ubuntu-os-cloud \
      --metadata-from-file startup-script=deploy/setup-openreview-web.sh

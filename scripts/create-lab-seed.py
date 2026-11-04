"""Create a NoCloud ISO from a public key; private keys never enter the repository."""
import argparse
import io
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--name', required=True)
parser.add_argument('--public-key', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--tools-dir')
args = parser.parse_args()
if args.tools_dir:
    sys.path.insert(0, args.tools_dir)
import pycdlib

public_key = Path(args.public_key).read_text().strip()
user_data = f'''#cloud-config
hostname: {args.name}
manage_etc_hosts: true
users:
  - name: sunbeam
    groups: [adm, sudo]
    shell: /bin/bash
    lock_passwd: true
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - {public_key}
ssh_pwauth: false
disable_root: true
package_update: false
final_message: "Sunbeam lab guest initialized."
'''
meta_data = f'instance-id: {args.name}-20261104\nlocal-hostname: {args.name}\n'
iso = pycdlib.PyCdlib()
iso.new(interchange_level=3, joliet=3, rock_ridge='1.09', vol_ident='cidata')
for iso_name, name, data in [('USERDATA.;1','user-data',user_data),('METADATA.;1','meta-data',meta_data)]:
    contents = data.encode()
    iso.add_fp(io.BytesIO(contents), len(contents), iso_path='/'+iso_name, rr_name=name, joliet_path='/'+name)
iso.write(args.output)
iso.close()
print('Created seed ISO for', args.name)

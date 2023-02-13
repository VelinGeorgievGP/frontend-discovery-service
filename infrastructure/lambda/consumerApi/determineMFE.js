const determineMFE = (mfe, user) => {
  const defaultVersion = mfe.versions.find((v) => v.deployment.default);
  try {
    // 1: Return singular
    if (mfe.versions.length === 1) return mfe.versions[0];

    const versionString = mfe.versions.reduce(
      (res, cur) => `${res}-${cur.metadata.version}`,
      ""
    );
    const mfeHash = hashCode(mfe.mfeName + versionString);
    const userHash = hashCode(user);
    const mod = Math.abs((mfeHash + userHash) % 100);
    let iterator = 0;
    let deploymentVersion;

    for (let version of mfe.versions) {
      iterator += version.deployment.traffic;
      if (iterator >= mod) {
        deploymentVersion = version;
        break;
      }
    }

    if (deploymentVersion) return deploymentVersion;

    return defaultVersion;
  } catch {
    return defaultVersion;
  }
};

export const hashCode = (str) => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export default determineMFE;

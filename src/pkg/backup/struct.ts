/* eslint-disable camelcase */

export type ResourceMeta = {
  name: string;
  url: string;
  ts: number;
  mimetype?: string;
};

export type ResourceBackup = {
  meta: ResourceMeta;
  // text数据
  source?: string;
  // 二进制数据
  base64: string;
};

export type ValueStorage = {
  data: { [key: string]: any };
  ts: number;
};

export type ScriptOptions = {
  check_for_updates: boolean;
  comment: string | null;
  compat_foreach: boolean;
  compat_metadata: boolean;
  compat_prototypes: boolean;
  compat_wrappedjsobject: boolean;
  compatopts_for_requires: boolean;
  noframes: boolean | null;
  override: {
    merge_connects: boolean;
    merge_excludes: boolean;
    merge_includes: boolean;
    merge_matches: boolean;
    orig_connects: Array<string>;
    orig_excludes: Array<string>;
    orig_includes: Array<string>;
    orig_matches: Array<string>;
    orig_noframes: boolean | null;
    orig_run_at: string;
    use_blockers: Array<string>;
    use_connects: Array<string>;
    use_excludes: Array<string>;
    use_includes: Array<string>;
    use_matches: Array<string>;
  };
  run_at: string | null;
};

export type ScriptMeta = {
  name: string;
  uuid?: string; // tm会对同名的uuid校验,先屏蔽了
  sc_uuid: string; // 脚本猫uuid
  modified: number;
  file_url: string;
  subscribe_url?: string;
};

export type ScriptOptionsFile = {
  options: ScriptOptions;
  settings: { enabled: boolean; position: number };
  meta: ScriptMeta;
};

export type ScriptInfo = {
  name: string;
  code: string;
};

export type ScriptBackupData = {
  code: string;
  options?: ScriptOptionsFile;
  storage: ValueStorage;
  requires: ResourceBackup[];
  requiresCss: ResourceBackup[];
  resources: ResourceBackup[];
};

export type SubscribeScript = {
  uuid: string;
  url: string;
};

export type SubscribeMeta = {
  name: string;
  modified: number;
  url: string;
};

export type SubscribeOptionsFile = {
  settings: { enabled: boolean };
  scripts: { [key: string]: SubscribeScript };
  meta: SubscribeMeta;
};

export type SubscribeBackupData = {
  source: string;
  options?: SubscribeOptionsFile;
};

export type BackupData = {
  script: ScriptBackupData[];
  subscribe: SubscribeBackupData[];
};

#!/usr/bin/env node

require('../bin/index');

/**
 *  /usr/bin/env 用来告诉用户到 path 目录下去寻找 node。
 *  #!/usr/bin/env node 可以让系统动态的去查找 node，以解决不同机器不同用户设置不一致问题。
 *  该命令必须放在第一行， 否者不会生效。
 * 
 */

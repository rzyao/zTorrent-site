/**
 * 更新 routes 表中的 component 字段
 * 将旧的 AdminXxx 命名统一为规范的 XxxPage 命名
 */
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: '192.168.50.2',
  port: 5432,
  user: 'ztorrent',
  password: 'TMYBKC47Jm8w4SB7',
  database: 'ztorrent',
});

// 映射表：旧名称 -> 新名称
const componentMapping = {
  // 核心概览
  'AdminDashboard': 'DashboardPage',
  
  // 种子管理
  'AdminTorrents': 'TorrentsListPage',
  'AdminTorrentRecords': 'TorrentRecordsPage',
  'AdminTorrentDownloadRecords': 'TorrentDownloadRecordsPage',
  'AdminUserDownloadRecords': 'UserDownloadRecordsPage',
  
  // 影视库
  'AdminFilms': 'FilmsPage',
  'AdminPlaylists': 'AdminPlaylistsPage', // 保留 Admin 前缀，避免与 App 模块冲突
  
  // 分类配置
  'AdminTorrentCategories': 'TorrentCategoriesPage',
  'AdminMovieCategories': 'MovieCategoriesPage',
  'AdminSeriesCategories': 'SeriesCategoriesPage',
  'AdminPlaylistCategories': 'PlaylistCategoriesPage',
  'AdminAdultTorrentCategories': 'AdultTorrentCategoriesPage',
  'AdminAdultMovieCategories': 'AdultMovieCategoriesPage',
  'AdminAdultSeriesCategories': 'AdultSeriesCategoriesPage',
  'AdminAdultPlaylistCategories': 'AdultPlaylistCategoriesPage',
  
  // 用户管理
  'AdminUsers': 'UsersPage',
  'AdminPunishmentRecords': 'PunishmentsPage',
  'AdminLevels': 'LevelsPage',
  
  // 权限中心
  'AdminRoles': 'RolesPage',
  'AdminWebPermissions': 'WebPermissionsPage',
  'AdminAdminPermissions': 'AdminPermissionsPage',
  
  // 互动管理
  'AdminTicketsList': 'AdminTicketsPage', // 保留 Admin 前缀，避免与 App 模块冲突
  'AdminTicketDetail': 'TicketDetailPage',
  'AdminRecommendationConfig': 'RecommendationsPage',
  
  // 邀请系统
  'AdminInvitesList': 'InvitesListPage',
  'AdminInviteQuotaList': 'InviteQuotaPage',
  'AdminInvitesStatistics': 'InvitesStatisticsPage',
  'AdminSendInvite': 'SendInvitePage',
  
  // 魔力值中心
  'AdminBonusBalances': 'BonusBalancesPage',
  'AdminBonusLedger': 'BonusLedgerPage',
  'AdminBonusBatchAdjust': 'BonusBatchAdjustPage',
  'AdminBonusRules': 'BonusRulesPage',
  'AdminBonusAdjustments': 'BonusAdjustmentsPage',
  
  // 商城管理
  'AdminStoreItems': 'StoreItemsPage',
  'AdminStoreOrders': 'StoreOrdersPage',
  
  // 系统配置
  'AdminSystemSettings': 'SystemSettingsPage',
  
  // 字典管理
  'AdminPunishmentTypes': 'PunishmentTypesPage',
  'AdminBanReasons': 'BanReasonsPage',
  'AdminUnbanReasons': 'UnbanReasonsPage',
  'AdminBanDays': 'BanDaysPage',
};

async function main() {
  try {
    await client.connect();
    console.log('✅ 已连接到数据库');

    // 1. 查询当前 routes 表中的 component 值
    const selectResult = await client.query(
      "SELECT id, name, component FROM routes WHERE component IS NOT NULL ORDER BY id"
    );
    
    console.log('\n📋 当前 routes 表中的 component 值：');
    console.log('─'.repeat(80));
    for (const row of selectResult.rows) {
      const needsUpdate = componentMapping[row.component] ? '⚠️ 需更新' : '✓';
      console.log(`${needsUpdate} [${row.id}] ${row.name} → ${row.component}`);
    }

    // 2. 执行更新
    console.log('\n🔄 开始更新...');
    let updatedCount = 0;
    
    for (const [oldName, newName] of Object.entries(componentMapping)) {
      const updateResult = await client.query(
        'UPDATE routes SET component = $1 WHERE component = $2',
        [newName, oldName]
      );
      
      if (updateResult.rowCount > 0) {
        console.log(`  ✅ ${oldName} → ${newName} (${updateResult.rowCount} 条记录)`);
        updatedCount += updateResult.rowCount;
      }
    }

    console.log(`\n🎉 更新完成！共更新 ${updatedCount} 条记录。`);

    // 3. 验证更新结果
    const verifyResult = await client.query(
      "SELECT id, name, component FROM routes WHERE component LIKE 'Admin%' AND component NOT IN ('AdminPlaylistsPage', 'AdminTicketsPage', 'AdminPermissionsPage') ORDER BY id"
    );
    
    if (verifyResult.rows.length > 0) {
      console.log('\n⚠️ 以下记录仍使用旧命名（可能遗漏）：');
      for (const row of verifyResult.rows) {
        console.log(`  [${row.id}] ${row.name} → ${row.component}`);
      }
    } else {
      console.log('\n✅ 所有记录已更新为规范命名！');
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 数据库连接已关闭');
  }
}

main();

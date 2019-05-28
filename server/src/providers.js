import { collectionFactory, modelFactory } from './utils/database'

const idIndex = {
  fieldName: '_id',
  unique: true,
}

//用户
export const Users = modelFactory(collectionFactory('users', idIndex))
//书本
export const Books = modelFactory(collectionFactory('books', idIndex))
//书本实例
export const BookInstances = modelFactory(collectionFactory('bookinstances', idIndex))
//书架
export const BookShelf = modelFactory(collectionFactory('bookshelf', idIndex))
//借阅表
export const BorrowList = modelFactory(collectionFactory('borrowlist', idIndex))
//种类表
export const Genres = modelFactory(collectionFactory('genres', idIndex))
//搜索表
export const Searchs = modelFactory(collectionFactory('Searchs', idIndex))

const GenreArr = ['玄幻', '都市', '奇幻', '仙侠', '现实', '历史', '体育', '游戏', '悬疑', '武侠', '灵异', '科幻'];
const descArr = [
  `当扑面而来的时代巨澜把懵懵懂懂的沙正阳卷入其中时，他是随波逐流，风花雪月，还是长缨在手，逆流击波？干想干的事，为恣意人生。做该做的事，为家国情怀。一万年太久，只争朝夕！到中流击水，浪遏飞舟！`,
  `供应诸天第一站：斗破苍穹；契约人：萧炎；恶魔果实：烧烧果实;供应诸天第二站：神墓；契约人：辰南；恶魔果实：闪闪果实;供应诸天第三站：斗罗大陆；契约人：唐三；恶魔果实:金属果实;供应诸天第四站:遮天；契约人:叶凡；恶魔果实:响雷果实……重温大神路，致敬经典。这是一个供应诸天的故事。`,
  `苟的嘛，就不谈了！不骚怎么吃鸡？不仅得够骚，还要学会嘤嘤嘤，一拳捶死嘤嘤怪，怎么说？看刘磊勾搭一波高德伟，叱咤吃鸡赛场，捶死韩国棒子！什么？你要石锤我开挂？抱歉，我的确开挂了，系统挂，人体植入挂，随随便便29杀！随你锤，我保证不寄律师函！`,
  `天禧五年初，有神鸟现世，其色银白，两翼吞吐烟火横空而行，坠于京城之西。 ——《北宋天书野录》  “神鸟？这玩意怎么感觉更像是我乘坐的失事飞机？”本书主角李璋有些疑惑的道，“另外我是谁的大表哥？”`,
  `这是一个就业路上屡被蹂躏的古汉语专业研究生，回到了明朝中叶，进入了山村一家幼童身体后的故事。木讷父亲泼辣娘，一水的极品亲戚，农家小院是非不少。好在，咱有几千年的历史积淀，四书五经八股文，专业也对口，谁言寒门再难出贵子。国力上升垂拱而治；法纪松弛，官纪慵散；有几只奸臣，也闹点倭寇；但总体上可以说，这是士大夫自由滋生的沃土。一个寒门崛起的传奇也就从这里生长了。`,
  `一个普普通通的凡人，重生来到了神秘莫测的修仙世界，成为一个小家族修士。长辈的殷切希望，家族举步维艰。面对种种不利的局面，张志玄一步步奋斗挣扎，逆流而上，将自己的家族发展壮大，书写了他如梦如电、波澜壮阔的一生。`,
  `年，葛小天在自家地头搭了个草棚，不料，里面蹿出俩壮汉。……帝国时代啊？可这是现代社会啊！难道要我推着火炮去攻打县城？我石乐志，还是你石乐志？算了，咱们还是一起去搬砖吧，等赚了钱，再包个小工地。然后……全球建造集团成立了……`,
  `20世纪明朝人穿什么？挣多少钱？20世纪的东厂和锦衣卫是什么样子的？20世纪的大明皇室和内阁，谁听谁的？明、清之间的坦克战怎么打？大明潜艇如何封锁日本列岛？`,
  `书中自有颜如玉，书中自有黄金屋。一旦学有所成，便能朝为田舍郎，暮登天子堂。韩四不通经史，不谙子集，无缘科举，想光宗耀祖，只能去捐一个官！`,
  `不要和我说谎，我能够闻到你身上间谍的味道——孟绍原。一个微表情专家，当穿越来到一九三六年的南京，成为一名军统特工，他确定，自己能够改变很多东西。`,
  `穿越成了光明神，从此开启招收信徒，发展神国，称王称霸，为所欲为的羞耻日子`,
  `剑仙画地三千里，魔头血祭十万人，这是武道可通神的神话江湖。韩枫穿越了。附身到一个乡下小捕快的身上，每日与腥风血雨擦肩而过。所幸随身武道系统可以将所有难题转化为任务，完成任务就可以获得神功秘籍乃至于武侠人物。从此金刚不坏神功威震武林泰半、太极拳剑成为江湖传奇、三分归元气斗败天下名宿、兵甲武经修成武道神仙！建立武道天庭，无数武侠人物封名神话，李逍遥留名上洞八仙、白发魔女化身斗姆元君、三英二云主宰武林命运、火云邪神威压天下佛门……`,
  `驱逐北元，扫清天下，明太祖固有一死。书生当国，藩王虎视，削藩靖难，血火刀锋中，杀出凛凛新明朝。一个失业的锦衣卫，一个卑微的小人物，左持剑，右握锄，一剑平天下，一锄养万民。这是个小特工，奋斗成为盛世大豪的曲折故事。大明盛世有千钧，锦衣卫担八百！翻开《永乐大典》，尽是我的传说！`,
  `高黎，带着一双AR眼穿越古风世界，能一眼看穿众人经脉。在这妖魔乱舞之地，他唯一要做的，就是先赚他一个亿。然后打造一个全新的【真气朋克】世界！`,
  `重生平行世界，这里却处处透着诡异……午夜十二点后不准进入卫生间。凌晨两点准时响起敲门声。一个披头散发、骨瘦如柴的女人总是背对着自己。撞鬼了！还好我可以回档。这是一个重生者在灵异入侵现实的世界里，步步为营，用奇葩姿势对抗灵异的故事。`,
  `我林凡成为富家子弟，必须得享受。修炼？不现实的事情。最多加加点。阅读此书可能带来不适，此书已经注满乳白的正能量。`,
  `全息战争网游《盛世》上线，领主玩家秦凡进入游戏成为了一名新手村长，但他很快发现了一件怪事儿：村里的人口根本不需要时间累积而是直接秒刷到上限，即使是被山贼洗劫杀害或者就地遣散，秒秒钟又能回来，仿佛生生不息无穷无尽……`,
  `才华横溢的前KPL职业选手何良，拥有一段令人失望的职业生涯，最终黯然退役。一直在其背后默默支持着他的弟弟何遇不忿哥哥职业生涯期间的遭遇，决心重走哥哥的职业路。观看过无数王者荣耀职业比赛拥有高端意识的他从未亲手接触过游戏，就这样毅然冲向了属于他的王者时刻。`
];

const publisherArr = ['菱堂', '重生', '仙宫', '暗月', '爷傲', '仙道', '儒道', '魔改', '爽歪歪'];

const bookFirstName = ['超神', '重生', '穿越', '猥琐', '最强', '修真', '洪荒', '霸道', '人渣'];
const bookMidName = ['总裁', '同桌', '邻居', '老头', '女生', '少年', '师父', '老爹', '奴才', '大师'];
const bookFamilyName = ['爱上我', '穿越记', '大闹唐朝', '勇夺诺贝尔奖', '抢救地球', '火星漫游', '的奇幻人生', '称霸侏罗纪', '梦回明朝', '那些事'];
const authorNmae = ['嗷呜超凶', '寄吧三少', '岸本骑史', '尾田荣三郎', '田上雄彦', '宝奇英高', '尖峰传奇', '谭俊健真帅', 'TJJ'];

function randomIndex(count) {
  return Math.round(Math.random() * (count - 1));
}

async function createGenre() {
  for (let i = 0; i < GenreArr.length; ++i) {
    let data = {
      name: GenreArr[i],
    }
    await Genres.insert(data);
  }
}

async function createBook() {
  let genrelist = await Genres.find({});
  for (let i = 0; i < genrelist.length; ++i) {
    const rand = randomIndex(30) + 10;
    for (let j = 0; j < rand; ++j) {
      let name = bookFirstName[randomIndex(bookFirstName.length)] + bookMidName[randomIndex(bookMidName.length)] + bookFamilyName[randomIndex(bookFamilyName.length)];
      let author = authorNmae[randomIndex(bookFirstName.length)];
      let desc = descArr[randomIndex(descArr.length)];
      let genrearr = [];
      genrearr.push(genrelist[i]._id);
      let lendTimes = randomIndex(100) + 10;
      let maleClick = randomIndex(100) + 10;
      let femaleClick = randomIndex(100) + 10;
      let allClick = maleClick + femaleClick + randomIndex(100);
      let publisher = publisherArr[randomIndex(publisherArr.length)] + '出版社';
      let time = new Date();
      let createtime = time.getTime() - 86400000 * randomIndex(7);
      let filepath = '/public/img/' + randomIndex(15) + '.jpg';
      let doc = {
        name,
        desc,
        author,
        publisher,
        genres: genrearr,
        filepath,
        lendTimes,
        maleClick,
        femaleClick,
        allClick,
        time: createtime
      }
      await Books.insert(doc);
    }
  }
}

async function createBookInstance() {
  let booklist = await Books.find({});
  for (let i = 0; i < booklist.length; ++i) {
    const rand = randomIndex(30) + 2;
    for (let j = 0; j < rand; ++j) {
      const data = {
        bookid: booklist[i]._id,
        state: 0,
        borrowtime: 0,
        backtime: 0,
      }
      await BookInstances.insert(data);
    }
  }
}

async function initData() {
  // await createGenre();
  await createBook();
  await createBookInstance();
}

// initData();

async function checkBorrowBook() {
  setInterval(async function () {
    let list = await BorrowList.find({ backTime: 0 });
    let date = new Date();
    let time = date.getTime();
    list.forEach(async item => {
      if (item.borrowTime + 86400000 * 3 < time) {
        let newdoc = await BorrowList.updateOne({ _id: item._id }, { $set: { 'backTime': time } });
        let bookinstances = await BookInstances.updateOne({ _id: item.bookinstanceid }, { $set: { 'backtime': time } });
      }
    })
  }, 6000);
}
checkBorrowBook();
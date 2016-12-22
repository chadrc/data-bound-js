/**
 * Created by chad on 12/21/16.
 */

let articleCats = ["News", "Entertainment", "Technology", "Arts", "Politics"];
let articleTags = ["Animals", "Celebrities", "Funny", "Global", "Finance"];

let articleCount = 20;

let paragraphs = [
  `<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ullamcorper orci erat, in ornare dui ullamcorper et. Vestibulum tincidunt suscipit luctus. Duis vitae urna ac sem tincidunt finibus congue eu augue. Pellentesque vitae ex elit. Nam vitae leo at dui laoreet mollis. Quisque iaculis facilisis tellus id dapibus. Nam condimentum, mauris vel fringilla placerat, dolor urna porta enim, vel interdum ante velit vel lectus. In efficitur purus eu quam euismod dignissim. Pellentesque id semper nulla, ut ornare est. Donec sit amet purus mi. Suspendisse interdum bibendum gravida. Donec cursus sit amet ligula in vestibulum. Proin bibendum efficitur aliquet.
  </p>`,
  `<p>
  In dapibus sodales lacinia. Cras convallis, arcu quis lobortis aliquam, neque neque interdum neque, quis vestibulum magna metus ac dui. Quisque pulvinar diam non scelerisque dignissim. Donec rhoncus metus nisi. Morbi fringilla ut enim in cursus. Ut id orci ante. Cras quis semper velit. Pellentesque egestas tortor vitae lacus hendrerit, eget eleifend purus cursus. Suspendisse tempor, ex nec ultricies aliquet, massa augue vehicula nisl, ac gravida arcu arcu eu mauris. Vivamus pellentesque, erat vel sodales sagittis, augue libero consectetur dui, at porttitor mauris elit at dui.
  </p>`,
  `<p>
  Praesent maximus vulputate fringilla. Aliquam rhoncus sit amet nibh ut fermentum. Nam id ipsum urna. Duis vitae mauris bibendum enim egestas mattis nec ac felis. Aenean dapibus, augue non dapibus tempor, nisl justo rhoncus felis, at facilisis mauris nulla vel purus. In hendrerit, odio quis tristique suscipit, orci turpis efficitur eros, in interdum ante quam a tortor. Ut faucibus tristique ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam massa quam, faucibus eget commodo at, maximus ac sapien. Morbi pulvinar ante eget lorem tempus, quis ornare augue fermentum. Duis enim dolor, iaculis vitae vehicula vel, accumsan in neque. Nam mattis, nibh eu pellentesque malesuada, neque felis congue ligula, lobortis rutrum velit nibh auctor leo. Proin enim est, tristique vel congue a, finibus ac quam.
  <img class="float-xs-right" src="images/blue-square.png" width="200px" height="200px"><img class="float-xs-left" src="images/blue-square.png" width="200px" height="200px">
  </p>`,
  `<p>
  In rhoncus eleifend ante, id mollis risus interdum rhoncus. Nulla tempus felis id massa mattis ornare. Sed vehicula eleifend suscipit. Ut et libero purus. Nunc porttitor et mauris mattis pretium. Nullam et lectus lectus. Phasellus elementum venenatis ligula in suscipit. Nullam nibh neque, fringilla vehicula dui vitae, fringilla egestas odio.
  </p>`,
  `<p>
  Nulla fermentum diam ac dui ornare, et mollis est lobortis. Integer gravida ipsum quis magna pellentesque scelerisque. Morbi sit amet sagittis purus. Fusce lorem purus, ultricies non tellus et, tempor pharetra eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum in pulvinar nibh. Vivamus porttitor condimentum tristique.
  </p>`,
  `<p>
  Aenean nec interdum nunc. Quisque maximus tristique ipsum, a aliquam nisl porttitor id. Integer congue sem id pharetra vestibulum. Proin ullamcorper nunc ut ultricies faucibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum gravida mauris eget libero volutpat, eu pellentesque leo porttitor. Praesent consectetur magna quis leo tincidunt, ut sagittis lorem elementum. Integer commodo tristique urna quis feugiat. Curabitur sed congue augue. Etiam eu accumsan sem. Maecenas ex velit, posuere ut orci in, feugiat venenatis erat. Nulla et leo cursus, auctor arcu quis, faucibus justo. Donec ornare odio arcu, vel interdum velit feugiat ac.
  <img class="float-xs-right" src="images/blue-square.png" width="400px" height="200px">
  </p>`,
  `<p>
  Nulla commodo lectus vel dui accumsan volutpat. In euismod, massa ac sagittis consectetur, purus justo dignissim turpis, in congue arcu ligula eu metus. Nulla lectus urna, cursus quis sollicitudin sit amet, lobortis et quam. Donec sollicitudin nulla et tortor interdum, nec vestibulum erat congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean tempor justo ut tellus accumsan commodo. Aliquam leo mauris, semper ut venenatis nec, rhoncus et lacus. Aliquam eget dui sed turpis volutpat tristique quis ac ipsum. Integer iaculis malesuada orci a commodo. Cras lobortis placerat nunc, et hendrerit est iaculis vitae.
  </p>`,
  `<p><img class="float-xs-right" src="images/blue-square.png" width="200px" height="300px">
  Praesent blandit mauris at nisi lacinia aliquam nec ut arcu. Etiam maximus, massa a pretium scelerisque, sem ante molestie tortor, eu commodo leo dolor ac nisi. Pellentesque vel fringilla lectus. Sed a tellus ac neque convallis semper. Nulla fermentum turpis quis justo posuere tincidunt vitae finibus lorem. Donec non purus quis est tristique iaculis eget id turpis. Aliquam vitae imperdiet ipsum.
  </p>`,
  `<p>
  Aliquam eget dictum purus. Nulla rutrum libero dolor, a pulvinar risus tristique sit amet. Fusce vitae ligula id elit facilisis semper. Nam lacinia velit nec luctus bibendum. Vivamus et elit tellus. Quisque ut consequat sapien. Cras vestibulum enim metus, et vestibulum felis tempor fermentum. Morbi eros nunc, lobortis eu libero sit amet, vestibulum convallis libero. Aliquam pharetra risus quis nisi porttitor tincidunt.
  </p>`,
  `<p>
  Suspendisse mollis dui sed eros finibus, a pulvinar ex pellentesque. Proin vel nisl eu lectus varius vulputate. Aliquam viverra urna vel tellus pulvinar, sed tempus magna vehicula. Integer tempor convallis libero, non sagittis mi pellentesque vitae. In ut velit lectus. Donec efficitur egestas vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse potenti. Integer a augue metus. Sed vehicula augue ultrices massa mattis, a ultrices ante laoreet.
  </p>`,
  `<p>
  Sed vestibulum massa ex, sit amet scelerisque justo maximus nec. Donec turpis dui, molestie quis augue quis, ultricies placerat nibh. Cras sed viverra enim, non tincidunt nibh. Nulla dolor purus, interdum at suscipit ut, tincidunt nec risus. Morbi dapibus, nisl non vestibulum mollis, quam tellus viverra quam, ut congue mi diam quis tellus. Nulla placerat diam in massa tincidunt volutpat. Vivamus enim turpis, vehicula eget pellentesque non, fermentum nec libero. Nulla sit amet finibus odio. Quisque congue, velit quis pharetra semper, arcu nunc euismod diam, molestie congue tortor augue a mauris. Nunc semper massa id turpis interdum, a feugiat felis dapibus. Etiam aliquet orci in augue laoreet, ac egestas orci bibendum. Curabitur aliquam urna ac condimentum lobortis. Aliquam odio arcu, gravida vel ante sed, lobortis molestie justo. Donec tempus, quam ut placerat fermentum, erat libero convallis ligula, eget fringilla dui orci a tellus.
  </p>`,
  `<p>
  Nunc nunc ex, iaculis at metus sed, bibendum elementum ex. Pellentesque at consectetur orci, non placerat dolor. Maecenas nec elit placerat, pretium libero quis, viverra nisi. Duis vitae ullamcorper lectus. Donec sodales metus convallis, volutpat risus vel, euismod tortor. Nullam convallis tellus ut lectus facilisis dignissim. Nulla tincidunt volutpat lacus, nec pretium nulla scelerisque eu. Nulla quis arcu ac turpis maximus dignissim quis a nibh. Sed non pellentesque nunc. Nulla placerat eget ipsum ac facilisis. Vestibulum venenatis venenatis posuere.
  </p>`,
  `<p><img class="float-xs-right" src="images/blue-square.png" width="400px" height="250px">
  Praesent dignissim tempor nulla bibendum vehicula. Pellentesque scelerisque vel nibh ut finibus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vitae augue hendrerit, efficitur tellus et, sodales ligula. Duis consectetur viverra nulla eget iaculis. Sed maximus consectetur sapien sit amet laoreet. Phasellus tempor id erat sit amet pharetra. Nullam gravida vulputate augue, a finibus nulla. Quisque rhoncus auctor malesuada. Morbi in lorem sollicitudin, venenatis erat eget, ultrices nisi. Sed id aliquam tortor, vel porta massa. Nulla facilisis sem ut nisi cursus, tincidunt aliquam arcu aliquet. Vivamus arcu elit, elementum vitae libero sit amet, lacinia efficitur dui. Morbi id scelerisque dui. Vivamus nec elit dolor.
  </p>`,
  `<p>
  Ut ac ipsum dictum, dapibus nunc id, efficitur leo. Donec in libero sed arcu lacinia porttitor quis nec magna. Suspendisse eget mattis orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus blandit tortor eu leo faucibus, ut dignissim diam sagittis. Etiam varius mi eget lacinia egestas. In bibendum ultrices magna. Cras sollicitudin mi nulla, eget bibendum dui ultricies sit amet. Integer semper lectus erat, eget faucibus sapien scelerisque at. Sed commodo feugiat massa congue vestibulum. Curabitur vehicula ultrices enim ut pretium.
  </p>`,
  `<p>
  Fusce mattis turpis ex, vitae bibendum orci suscipit ac. Sed a lacus nulla. Donec pellentesque mi vel sapien lacinia volutpat. Suspendisse imperdiet turpis diam, vel sagittis nibh sollicitudin non. Duis commodo risus fermentum, sagittis orci a, interdum tellus. Morbi laoreet nunc vitae massa ullamcorper, sit amet pharetra est pellentesque. Nulla sit amet sodales mi, sit amet ultricies felis. Donec placerat ornare velit quis placerat. Maecenas suscipit lorem vel ligula fermentum, suscipit dictum tellus dignissim.
  </p>`,
  `<p>
  Aliquam feugiat ante ac dui lacinia, vel posuere dolor pellentesque. Nullam mollis, diam eu pulvinar venenatis, odio justo lacinia arcu, non consectetur ante nisi eget lacus. Duis ac urna sit amet nunc varius faucibus. Integer iaculis viverra urna, id commodo velit lobortis non. Fusce eget enim pellentesque mi posuere condimentum. Etiam sit amet vulputate erat. Suspendisse finibus sem ut tellus tempus, ut molestie orci commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer posuere cursus enim in gravida. Donec ultrices aliquet fermentum. Nullam at elementum sapien. Mauris a consequat elit. Vestibulum vel pharetra dui. Ut a convallis arcu. Praesent interdum molestie pharetra.
  <img class="float-xs-right" src="images/blue-square.png" width="250px" height="250px">
  </p>`,
  `<p>
  Phasellus porttitor purus in quam lacinia semper. Proin ac velit vel sem porttitor pellentesque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras euismod sit amet velit at interdum. Cras faucibus diam enim, a congue felis varius ut. Duis nisl est, ornare quis sollicitudin nec, posuere id risus. Vivamus commodo tortor quis molestie iaculis. Nullam rhoncus, diam sed cursus molestie, velit nibh vulputate nunc, sed elementum libero tortor quis sapien. Nulla sit amet semper sem. Maecenas non quam quis odio commodo mattis nec et nisi. Morbi viverra porta augue, vitae faucibus lectus vestibulum id. Sed enim tellus, auctor quis ante et, blandit pretium neque. Aliquam erat volutpat.
  <img class="float-xs-right" src="images/blue-square.png" width="200px" height="300px"></p>`,
  `<p>
  Maecenas iaculis eleifend placerat. Praesent a malesuada nisi. Ut venenatis, lorem et consequat rhoncus, dolor lorem feugiat lorem, eu convallis nulla dui quis dolor. Aliquam erat volutpat. Suspendisse malesuada placerat condimentum. Mauris ullamcorper velit ac auctor posuere. Sed ac nisi id sem feugiat lobortis non vitae nunc. Quisque eu odio sit amet est tincidunt lacinia nec eu libero. Suspendisse potenti. Nunc quam tortor, dignissim id finibus id, laoreet vel sem. Quisque a leo ac odio tempus ultricies ut ac diam. Nam ornare nibh et tellus malesuada venenatis. Vivamus nec sagittis velit. Maecenas cursus pharetra volutpat. Sed sed diam ac mi pretium dapibus. Ut dictum, tortor pellentesque imperdiet aliquam, urna felis suscipit elit, et volutpat quam ipsum eu libero.
  </p>`,
  `<p><img class="float-xs-left" src="images/blue-square.png" width="250px" height="250px">
  Sed dapibus justo eu felis condimentum iaculis. Donec non ante non enim sollicitudin lacinia at ut orci. In hac habitasse platea dictumst. Fusce at velit laoreet, ornare lectus eu, malesuada augue. Nullam id fringilla orci. Sed maximus sed sem et convallis. Nunc at sapien egestas augue consequat euismod. Cras quam quam, lobortis in pretium id, bibendum id mi. In at augue ultrices, mattis tortor ut, venenatis mauris. Fusce tincidunt lectus vitae erat maximus eleifend. Cras quis porta tortor. Aliquam a egestas elit. Duis dapibus mi vitae dui pulvinar pulvinar.
  </p>`,
  `<p>
  Fusce vel lectus iaculis, semper nibh at, convallis felis. Mauris ut blandit erat. Aenean interdum at justo volutpat fringilla. Nunc placerat fermentum eros, sit amet malesuada tellus varius id. Maecenas gravida finibus dolor quis iaculis. Morbi porta nulla purus, a pharetra tortor tempor sed. Nam a ligula ullamcorper, feugiat mi sed, porta libero. Vestibulum bibendum, orci id finibus tincidunt, nunc nisl sagittis justo, eget lobortis magna eros ac nulla. Phasellus volutpat turpis eu consectetur dapibus. Integer convallis ac eros sit amet porttitor. Vivamus ut nunc sollicitudin, porttitor urna et, pharetra arcu.
  </p>`
];

let articles = [];

for (let i=0; i<articleCount; i++) {
  let catIndex = Math.floor(Math.random() * articleCats.length);
  let tagCount = Math.floor(Math.random() * articleTags.length);
  let tags = [];
  for (let j=0; j<tagCount; j++) {
    tags.push(articleTags[Math.floor(Math.random() * articleTags.length)]);
  }
  let pCount = Math.floor(Math.random() * 5) + 3;
  let ps = [];
  for (let j=0; j<pCount; j++) {
    ps.push(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
  }

  articles.push({
    title: "Article " + i,
    category: categories[catIndex],
    tags: tags,
    text: ps.join('')
  })
}

let ArticlesData = {
  categories: articleCats,
  tags: articleTags,
  articles: articles
};
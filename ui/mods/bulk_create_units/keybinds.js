action_sets.hacks.bulk_paste_unit = function () {
  if (model.bulkPaste) model.bulkPaste()
}
api.settings.definitions.keyboard.settings.bulk_paste_unit = {
  title: 'bulk paste unit',
  type: 'keybind',
  set: 'mods',
  display_group: 'mods',
  display_sub_group: 'bulk create units',
  default: 'shift+ctrl+v'
}

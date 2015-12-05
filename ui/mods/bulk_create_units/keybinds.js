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

action_sets.hacks.bulk_paste_preview_toggle = function () {
  if (model.bulkPastePreviewToggle) model.bulkPastePreviewToggle()
}
api.settings.definitions.keyboard.settings.bulk_paste_preview_toggle = {
  title: 'toggle preview',
  type: 'keybind',
  set: 'mods',
  display_group: 'mods',
  display_sub_group: 'bulk create units',
  default: 'shift+ctrl+z'
}

action_sets.hacks.bulk_paste_next_formation = function () {
  if (model.bulkPastNextFormation) model.bulkPastNextFormation()
}
api.settings.definitions.keyboard.settings.bulk_paste_next_formation = {
  title: 'next formation',
  type: 'keybind',
  set: 'mods',
  display_group: 'mods',
  display_sub_group: 'bulk create units',
  default: 'shift+ctrl+f'
}

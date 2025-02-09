import type {
	blockTags,
	inlineTags,
	modifierTags,
} from "../utils/options/tsdoc-defaults";

export declare function buildTranslation(
	translations: BuiltinTranslatableStringConstraints,
): BuiltinTranslatableStringConstraints;
export declare function buildIncompleteTranslation(
	translations: Partial<BuiltinTranslatableStringConstraints>,
): Partial<BuiltinTranslatableStringConstraints>;
export declare const translatable: {
	readonly loaded_multiple_times_0: "TypeDoc has been loaded multiple times. This is commonly caused by plugins which have their own installation of TypeDoc. The loaded paths are:\n\t{0}";
	readonly unsupported_ts_version_0: "You are running with an unsupported TypeScript version! If TypeDoc crashes, this is why. TypeDoc supports {0}";
	readonly no_compiler_options_set: "No compiler options set. This likely means that TypeDoc did not find your tsconfig.json. Generated documentation will probably be empty";
	readonly loaded_plugin_0: "Loaded plugin {0}";
	readonly solution_not_supported_in_watch_mode: "The provided tsconfig file looks like a solution style tsconfig, which is not supported in watch mode";
	readonly strategy_not_supported_in_watch_mode: "entryPointStrategy must be set to either resolve or expand for watch mode";
	readonly found_0_errors_and_1_warnings: "Found {0} errors and {1} warnings";
	readonly docs_could_not_be_generated: "Documentation could not be generated due to the errors above";
	readonly docs_generated_at_0: "Documentation generated at {0}";
	readonly json_written_to_0: "JSON written to {0}";
	readonly no_entry_points_for_packages: "No entry points provided to packages mode, documentation cannot be generated";
	readonly failed_to_find_packages: "Failed to find any packages, ensure you have provided at least one directory as an entry point containing package.json";
	readonly nested_packages_unsupported_0: "Project at {0} has entryPointStrategy set to packages, but nested packages are not supported";
	readonly previous_error_occurred_when_reading_options_for_0: "The previous error occurred when reading options for the package at {0}";
	readonly converting_project_at_0: "Converting project at {0}";
	readonly failed_to_convert_packages: "Failed to convert one or more packages, result will not be merged together";
	readonly merging_converted_projects: "Merging converted projects";
	readonly no_entry_points_to_merge: "No entry points provided to merge";
	readonly entrypoint_did_not_match_files_0: "The entrypoint glob {0} did not match any files";
	readonly failed_to_parse_json_0: "Failed to parse file at {0} as json";
	readonly failed_to_read_0_when_processing_document_tag_in_1: "Failed to read file {0} when processing @document tag for comment in {1}";
	readonly failed_to_read_0_when_processing_project_document: "Failed to read file {0} when adding project document";
	readonly failed_to_read_0_when_processing_document_child_in_1: "Failed to read file {0} when processing document children in {1}";
	readonly frontmatter_children_0_should_be_an_array_of_strings_or_object_with_string_values: "Frontmatter children in {0} should be an array of strings or an object with string values";
	readonly converting_union_as_interface: "Using @interface on a union type will discard properties not present on all branches of the union. TypeDoc's output may not accurately describe your source code";
	readonly converting_0_as_class_requires_value_declaration: "Converting {0} as a class requires a declaration which represents a non-type value";
	readonly converting_0_as_class_without_construct_signatures: "{0} is being converted as a class, but does not have any construct signatures";
	readonly comment_for_0_should_not_contain_block_or_modifier_tags: "The comment for {0} should not contain any block or modifier tags";
	readonly symbol_0_has_multiple_declarations_with_comment: "{0} has multiple declarations with a comment. An arbitrary comment will be used";
	readonly comments_for_0_are_declared_at_1: "The comments for {0} are declared at:\n\t{1}";
	readonly multiple_type_parameters_on_template_tag_unsupported: "TypeDoc does not support multiple type parameters defined in a single @template tag with a comment";
	readonly failed_to_find_jsdoc_tag_for_name_0: "Failed to find JSDoc tag for {0} after parsing comment, please file a bug report";
	readonly relative_path_0_is_not_a_file_and_will_not_be_copied_to_output: "The relative path {0} is not a file and will not be copied to the output directory";
	readonly inline_inheritdoc_should_not_appear_in_block_tag_in_comment_at_0: "An inline @inheritDoc tag should not appear within a block tag as it will not be processed in comment at {0}";
	readonly at_most_one_remarks_tag_expected_in_comment_at_0: "At most one @remarks tag is expected in a comment, ignoring all but the first in comment at {0}";
	readonly at_most_one_returns_tag_expected_in_comment_at_0: "At most one @returns tag is expected in a comment, ignoring all but the first in comment at {0}";
	readonly at_most_one_inheritdoc_tag_expected_in_comment_at_0: "At most one @inheritDoc tag is expected in a comment, ignoring all but the first in comment at {0}";
	readonly content_in_summary_overwritten_by_inheritdoc_in_comment_at_0: "Content in the summary section will be overwritten by the @inheritDoc tag in comment at {0}";
	readonly content_in_remarks_block_overwritten_by_inheritdoc_in_comment_at_0: "Content in the @remarks block will be overwritten by the @inheritDoc tag in comment at {0}";
	readonly example_tag_literal_name: "The first line of an example tag will be taken literally as the example name, and should only contain text";
	readonly inheritdoc_tag_properly_capitalized: "The @inheritDoc tag should be properly capitalized";
	readonly treating_unrecognized_tag_0_as_modifier: "Treating unrecognized tag {0} as a modifier tag";
	readonly unmatched_closing_brace: "Unmatched closing brace";
	readonly unescaped_open_brace_without_inline_tag: "Encountered an unescaped open brace without an inline tag";
	readonly unknown_block_tag_0: "Encountered an unknown block tag {0}";
	readonly unknown_inline_tag_0: "Encountered an unknown inline tag {0}";
	readonly open_brace_within_inline_tag: "Encountered an open brace within an inline tag, this is likely a mistake";
	readonly inline_tag_not_closed: "Inline tag is not closed";
	readonly failed_to_resolve_link_to_0_in_comment_for_1: 'Failed to resolve link to "{0}" in comment for {1}';
	readonly failed_to_resolve_link_to_0_in_comment_for_1_may_have_meant_2: 'Failed to resolve link to "{0}" in comment for {1}. You may have wanted "{2}"';
	readonly failed_to_resolve_link_to_0_in_readme_for_1: 'Failed to resolve link to "{0}" in readme for {1}';
	readonly failed_to_resolve_link_to_0_in_readme_for_1_may_have_meant_2: 'Failed to resolve link to "{0}" in readme for {1}. You may have wanted "{2}"';
	readonly failed_to_resolve_link_to_0_in_document_1: 'Failed to resolve link to "{0}" in document {1}';
	readonly failed_to_resolve_link_to_0_in_document_1_may_have_meant_2: 'Failed to resolve link to "{0}" in document {1}. You may have wanted "{2}"';
	readonly type_0_defined_in_1_is_referenced_by_2_but_not_included_in_docs: "{0}, defined in {1}, is referenced by {2} but not included in the documentation";
	readonly reflection_0_kind_1_defined_in_2_does_not_have_any_documentation: "{0} ({1}), defined in {2}, does not have any documentation";
	readonly invalid_intentionally_not_exported_symbols_0: "The following symbols were marked as intentionally not exported, but were either not referenced in the documentation, or were exported:\n\t{0}";
	readonly not_all_search_category_boosts_used_0: "Not all categories specified in searchCategoryBoosts were used in the documentation. The unused categories were:\n\t{0}";
	readonly not_all_search_group_boosts_used_0: "Not all groups specified in searchGroupBoosts were used in the documentation. The unused groups were:\n\t{0}";
	readonly comment_for_0_includes_categoryDescription_for_1_but_no_child_in_group: 'Comment for {0} includes @categoryDescription for "{1}", but no child is placed in that category';
	readonly comment_for_0_includes_groupDescription_for_1_but_no_child_in_group: 'Comment for {0} includes @groupDescription for "{1}", but no child is placed in that group';
	readonly label_0_for_1_cannot_be_referenced: 'The label "{0}" for {1} cannot be referenced with a declaration reference. Labels may only contain A-Z, 0-9, and _, and may not start with a number';
	readonly modifier_tag_0_is_mutually_exclusive_with_1_in_comment_for_2: "The modifier tag {0} is mutually exclusive with {1} in the comment for {2}";
	readonly signature_0_has_unused_param_with_name_1: 'The signature {0} has an @param with name "{1}", which was not used';
	readonly declaration_reference_in_inheritdoc_for_0_not_fully_parsed: "Declaration reference in @inheritDoc for {0} was not fully parsed and may resolve incorrectly";
	readonly failed_to_find_0_to_inherit_comment_from_in_1: 'Failed to find "{0}" to inherit the comment from in the comment for {1}';
	readonly reflection_0_tried_to_copy_comment_from_1_but_source_had_no_comment: "{0} tried to copy a comment from {1} with @inheritDoc, but the source has no associated comment";
	readonly inheritdoc_circular_inheritance_chain_0: "@inheritDoc specifies a circular inheritance chain: {0}";
	readonly provided_readme_at_0_could_not_be_read: "Provided README path, {0} could not be read";
	readonly defaulting_project_name: 'The --name option was not specified, and no package.json was found. Defaulting project name to "Documentation"';
	readonly disable_git_set_but_not_source_link_template: "disableGit is set, but sourceLinkTemplate is not, so source links cannot be produced. Set a sourceLinkTemplate or disableSources to prevent source tracking";
	readonly disable_git_set_and_git_revision_used: "disableGit is set and sourceLinkTemplate contains {gitRevision}, which will be replaced with an empty string as no revision was provided";
	readonly git_remote_0_not_valid: 'The provided git remote "{0}" was not valid. Source links will be broken';
	readonly custom_css_file_0_does_not_exist: "Custom CSS file at {0} does not exist";
	readonly unsupported_highlight_language_0_not_highlighted_in_comment_for_1: "Unsupported highlight language {0} will not be highlighted in comment for {1}";
	readonly unloaded_language_0_not_highlighted_in_comment_for_1: "Code block with language {0} will not be highlighted in comment for {1} as it was not included in the highlightLanguages option";
	readonly yaml_frontmatter_not_an_object: "Expected YAML frontmatter to be an object";
	readonly could_not_write_0: "Could not write {0}";
	readonly could_not_empty_output_directory_0: "Could not empty the output directory {0}";
	readonly could_not_create_output_directory_0: "Could not create the output directory {0}";
	readonly theme_0_is_not_defined_available_are_1: "The theme '{0}' is not defined. The available themes are: {1}";
	readonly custom_theme_does_not_define_getSlugger: "Custom theme does not define a getSlugger(reflection) method, but tries to render markdown";
	readonly no_entry_points_provided: "No entry points were provided, this is likely a misconfiguration";
	readonly unable_to_find_any_entry_points: "Unable to find any entry points. See previous warnings";
	readonly watch_does_not_support_packages_mode: "Watch mode does not support 'packages' style entry points";
	readonly watch_does_not_support_merge_mode: "Watch mode does not support 'merge' style entry points";
	readonly entry_point_0_not_in_program: "The entry point {0} is not referenced by the 'files' or 'include' option in your tsconfig";
	readonly use_expand_or_glob_for_files_in_dir: "If you wanted to include files inside this directory, set --entryPointStrategy to expand or specify a glob";
	readonly glob_0_did_not_match_any_files: "The glob {0} did not match any files";
	readonly entry_point_0_did_not_match_any_files_after_exclude: "The glob {0} did not match any files after applying exclude patterns";
	readonly entry_point_0_did_not_exist: "Provided entry point {0} does not exist";
	readonly entry_point_0_did_not_match_any_packages: "The entry point glob {0} did not match any directories containing package.json";
	readonly file_0_not_an_object: "The file {0} is not an object";
	readonly serialized_project_referenced_0_not_part_of_project: "Serialized project referenced reflection {0}, which was not a part of the project";
	readonly saved_relative_path_0_resolved_from_1_is_not_a_file: "Serialized project referenced {0}, which does not exist or is not a file relative to {1}";
	readonly circular_reference_extends_0: 'Circular reference encountered for "extends" field of {0}';
	readonly failed_resolve_0_to_file_in_1: "Failed to resolve {0} to a file in {1}";
	readonly option_0_can_only_be_specified_by_config_file: "The '{0}' option can only be specified via a config file";
	readonly option_0_expected_a_value_but_none_provided: "--{0} expected a value, but none was given as an argument";
	readonly unknown_option_0_may_have_meant_1: "Unknown option: {0}, you may have meant:\n\t{1}";
	readonly typedoc_key_in_0_ignored: "The 'typedoc' key in {0} was used by the legacy-packages entryPointStrategy and will be ignored";
	readonly typedoc_options_must_be_object_in_0: 'Failed to parse the "typedocOptions" field in {0}, ensure it exists and contains an object';
	readonly tsconfig_file_0_does_not_exist: "The tsconfig file {0} does not exist";
	readonly tsconfig_file_specifies_options_file: '"typedocOptions" in tsconfig file specifies an option file to read but the option file has already been read. This is likely a misconfiguration';
	readonly tsconfig_file_specifies_tsconfig_file: '"typedocOptions" in tsconfig file may not specify a tsconfig file to read';
	readonly tags_0_defined_in_typedoc_json_overwritten_by_tsdoc_json: "The {0} defined in typedoc.json will be overwritten by configuration in tsdoc.json";
	readonly failed_read_tsdoc_json_0: "Failed to read tsdoc.json file at {0}";
	readonly invalid_tsdoc_json_0: "The file {0} is not a valid tsdoc.json file";
	readonly options_file_0_does_not_exist: "The options file {0} does not exist";
	readonly failed_read_options_file_0: "Failed to parse {0}, ensure it exists and exports an object";
	readonly invalid_plugin_0_missing_load_function: "Invalid structure in plugin {0}, no load function found";
	readonly plugin_0_could_not_be_loaded: "The plugin {0} could not be loaded";
	readonly help_options: "Specify a json option file that should be loaded. If not specified TypeDoc will look for 'typedoc.json' in the current directory";
	readonly help_tsconfig: "Specify a TypeScript config file that should be loaded. If not specified TypeDoc will look for 'tsconfig.json' in the current directory";
	readonly help_compilerOptions: "Selectively override the TypeScript compiler options used by TypeDoc";
	readonly help_lang: "Sets the language to be used in generation and in TypeDoc's messages";
	readonly help_locales: "Add translations for a specified locale. This option is primarily intended to be used as a stopgap while waiting for official locale support to be added to TypeDoc";
	readonly help_packageOptions: "Set options which will be set within each package when entryPointStrategy is set to packages";
	readonly help_entryPoints: "The entry points of your documentation";
	readonly help_entryPointStrategy: "The strategy to be used to convert entry points into documentation modules";
	readonly help_alwaysCreateEntryPointModule: "When set, TypeDoc will always create a `Module` for entry points, even if only one is provided";
	readonly help_projectDocuments: "Documents which should be added as children to the root of the generated documentation. Supports globs to match multiple files";
	readonly help_exclude: "Define patterns to be excluded when expanding a directory that was specified as an entry point";
	readonly help_externalPattern: "Define patterns for files that should be considered being external";
	readonly help_excludeExternals: "Prevent externally resolved symbols from being documented";
	readonly help_excludeNotDocumented: "Prevent symbols that are not explicitly documented from appearing in the results";
	readonly help_excludeNotDocumentedKinds: "Specify the type of reflections that can be removed by excludeNotDocumented";
	readonly help_excludeInternal: "Prevent symbols that are marked with @internal from being documented";
	readonly help_excludeCategories: "Exclude symbols within this category from the documentation";
	readonly help_excludePrivate: "Ignore private variables and methods, defaults to true.";
	readonly help_excludeProtected: "Ignore protected variables and methods";
	readonly help_excludeReferences: "If a symbol is exported multiple times, ignore all but the first export";
	readonly help_externalSymbolLinkMappings: "Define custom links for symbols not included in the documentation";
	readonly help_out: "Specify the location the documentation should be written to";
	readonly help_json: "Specify the location and filename a JSON file describing the project is written to";
	readonly help_pretty: "Specify whether the output JSON should be formatted with tabs";
	readonly help_emit: "Specify what TypeDoc should emit, 'docs', 'both', or 'none'";
	readonly help_theme: "Specify the theme name to render the documentation with";
	readonly help_lightHighlightTheme: "Specify the code highlighting theme in light mode";
	readonly help_darkHighlightTheme: "Specify the code highlighting theme in dark mode";
	readonly help_highlightLanguages: "Specify the languages which will be loaded to highlight code when rendering";
	readonly help_customCss: "Path to a custom CSS file to for the theme to import";
	readonly help_markdownItOptions: "Specify the options passed to markdown-it, the Markdown parser used by TypeDoc";
	readonly help_markdownItLoader: "Specify a callback to be called when loading the markdown-it instance. Will be passed the instance of the parser which TypeDoc will use";
	readonly help_maxTypeConversionDepth: "Set the maximum depth of types to be converted";
	readonly help_name: "Set the name of the project that will be used in the header of the template";
	readonly help_includeVersion: "Add the package version to the project name";
	readonly help_disableSources: "Disable setting the source of a reflection when documenting it";
	readonly help_sourceLinkTemplate: "Specify a link template to be used when generating source urls. If not set, will be automatically created using the git remote. Supports {path}, {line}, {gitRevision} placeholders";
	readonly help_gitRevision: "Use specified revision instead of the last revision for linking to GitHub/Bitbucket source files. Has no effect if disableSources is set";
	readonly help_gitRemote: "Use the specified remote for linking to GitHub/Bitbucket source files. Has no effect if disableGit or disableSources is set";
	readonly help_disableGit: "Assume that all can be linked to with the sourceLinkTemplate, sourceLinkTemplate must be set if this is enabled. {path} will be rooted at basePath";
	readonly help_basePath: "Specifies the base path to be used when displaying file paths";
	readonly help_excludeTags: "Remove the listed block/modifier tags from doc comments";
	readonly help_readme: "Path to the readme file that should be displayed on the index page. Pass `none` to disable the index page and start the documentation on the globals page";
	readonly help_cname: "Set the CNAME file text, it's useful for custom domains on GitHub Pages";
	readonly help_sourceLinkExternal: "Specifies that source links should be treated as external links to be opened in a new tab";
	readonly help_markdownLinkExternal: "Specifies that http[s]:// links in comments and markdown files should be treated as external links to be opened in a new tab";
	readonly help_githubPages: "Generate a .nojekyll file to prevent 404 errors in GitHub Pages. Defaults to `true`";
	readonly help_hostedBaseUrl: "Specify a base URL to be used in generating a sitemap.xml in our output folder and canonical links. If not specified, no sitemap will be generated";
	readonly help_useHostedBaseUrlForAbsoluteLinks: "If set, TypeDoc will produce absolute links to pages on your site using the hostedBaseUrl option";
	readonly help_hideGenerator: "Do not print the TypeDoc link at the end of the page";
	readonly help_customFooterHtml: "Custom footer after the TypeDoc link";
	readonly help_customFooterHtmlDisableWrapper: "If set, disables the wrapper element for customFooterHtml";
	readonly help_hideParameterTypesInTitle: "Hides parameter types in signature titles for easier scanning";
	readonly help_cacheBust: "Include the generation time in links to static assets";
	readonly help_searchInComments: "If set, the search index will also include comments. This will greatly increase the size of the search index";
	readonly help_searchInDocuments: "If set, the search index will also include documents. This will greatly increase the size of the search index";
	readonly help_cleanOutputDir: "If set, TypeDoc will remove the output directory before writing output";
	readonly help_titleLink: "Set the link the title in the header points to. Defaults to the documentation homepage";
	readonly help_navigationLinks: "Defines links to be included in the header";
	readonly help_sidebarLinks: "Defines links to be included in the sidebar";
	readonly help_navigationLeaves: "Branches of the navigation tree which should not be expanded";
	readonly help_navigation: "Determines how the navigation sidebar is organized";
	readonly help_visibilityFilters: "Specify the default visibility for builtin filters and additional filters according to modifier tags";
	readonly help_searchCategoryBoosts: "Configure search to give a relevance boost to selected categories";
	readonly help_searchGroupBoosts: 'Configure search to give a relevance boost to selected kinds (eg "class")';
	readonly help_jsDocCompatibility: "Sets compatibility options for comment parsing that increase similarity with JSDoc comments";
	readonly help_commentStyle: "Determines how TypeDoc searches for comments";
	readonly help_useTsLinkResolution: "Use TypeScript's link resolution when determining where @link tags point. This only applies to JSDoc style comments";
	readonly help_preserveLinkText: "If set, @link tags without link text will use the text content as the link. If not set, will use the target reflection name";
	readonly help_blockTags: "Block tags which TypeDoc should recognize when parsing comments";
	readonly help_inlineTags: "Inline tags which TypeDoc should recognize when parsing comments";
	readonly help_modifierTags: "Modifier tags which TypeDoc should recognize when parsing comments";
	readonly help_categorizeByGroup: "Specify whether categorization will be done at the group level";
	readonly help_defaultCategory: "Specify the default category for reflections without a category";
	readonly help_categoryOrder: "Specify the order in which categories appear. * indicates the relative order for categories not in the list";
	readonly help_groupOrder: "Specify the order in which groups appear. * indicates the relative order for groups not in the list";
	readonly help_sort: "Specify the sort strategy for documented values";
	readonly help_sortEntryPoints: "If set, entry points will be subject to the same sorting rules as other reflections";
	readonly help_kindSortOrder: "Specify the sort order for reflections when 'kind' is specified";
	readonly help_watch: "Watch files for changes and rebuild docs on change";
	readonly help_preserveWatchOutput: "If set, TypeDoc will not clear the screen between compilation runs";
	readonly help_skipErrorChecking: "Do not run TypeScript's type checking before generating docs";
	readonly help_help: "Print this message";
	readonly help_version: "Print TypeDoc's version";
	readonly help_showConfig: "Print the resolved configuration and exit";
	readonly help_plugin: "Specify the npm plugins that should be loaded. Omit to load all installed plugins";
	readonly help_logLevel: "Specify what level of logging should be used";
	readonly help_treatWarningsAsErrors: "If set, all warnings will be treated as errors";
	readonly help_treatValidationWarningsAsErrors: "If set, warnings emitted during validation will be treated as errors. This option cannot be used to disable treatWarningsAsErrors for validation warnings";
	readonly help_intentionallyNotExported: "A list of types which should not produce 'referenced but not documented' warnings";
	readonly help_requiredToBeDocumented: "A list of reflection kinds that must be documented";
	readonly help_validation: "Specify which validation steps TypeDoc should perform on your generated documentation";
	readonly unknown_option_0_you_may_have_meant_1: "Unknown option '{0}' You may have meant:\n\t{1}";
	readonly option_0_must_be_between_1_and_2: "{0} must be between {1} and {2}";
	readonly option_0_must_be_equal_to_or_greater_than_1: "{0} must be equal to or greater than {1}";
	readonly option_0_must_be_less_than_or_equal_to_1: "{0} must be less than or equal to {1}";
	readonly option_0_must_be_one_of_1: "{0} must be one of {1}";
	readonly flag_0_is_not_valid_for_1_expected_2: "The flag '{0}' is not valid for {1}, expected one of {2}";
	readonly expected_object_with_flag_values_for_0: "Expected an object with flag values for {0} or true/false";
	readonly flag_values_for_0_must_be_booleans: "Flag values for {0} must be a boolean";
	readonly locales_must_be_an_object: "The 'locales' option must be set to an object which resembles: { en: { theme_implements: \"Implements\" }}";
	readonly exclude_not_documented_specified_0_valid_values_are_1: "excludeNotDocumentedKinds may only specify known values, and invalid values were provided ({0}). The valid kinds are:\n{1}";
	readonly external_symbol_link_mappings_must_be_object: "externalSymbolLinkMappings must be a Record<package name, Record<symbol name, link>>";
	readonly highlight_theme_0_must_be_one_of_1: "{0} must be one of the following: {1}";
	readonly highlightLanguages_contains_invalid_languages_0: "highlightLanguages contains invalid languages: {0}, run typedoc --help for a list of supported languages";
	readonly hostedBaseUrl_must_start_with_http: "hostedBaseUrl must start with http:// or https://";
	readonly useHostedBaseUrlForAbsoluteLinks_requires_hostedBaseUrl: "The useHostedBaseUrlForAbsoluteLinks option requires that hostedBaseUrl be set";
	readonly option_0_must_be_an_object: "The '{0}' option must be a non-array object";
	readonly option_0_must_be_a_function: "The '{0}' option must be a function";
	readonly option_0_must_be_object_with_urls: "{0} must be an object with string labels as keys and URL values";
	readonly visibility_filters_only_include_0: "visibilityFilters can only include the following non-@ keys: {0}";
	readonly visibility_filters_must_be_booleans: "All values of visibilityFilters must be booleans";
	readonly option_0_values_must_be_numbers: "All values of {0} must be numbers";
	readonly option_0_values_must_be_array_of_tags: "{0} must be an array of valid tag names";
	readonly option_0_specified_1_but_only_2_is_valid: "{0} may only specify known values, and invalid values were provided ({1}). The valid sort strategies are:\n{2}";
	readonly kind_project: "Project";
	readonly kind_module: "Module";
	readonly kind_namespace: "Namespace";
	readonly kind_enum: "Enumeration";
	readonly kind_enum_member: "Enumeration Member";
	readonly kind_variable: "Variable";
	readonly kind_function: "Function";
	readonly kind_class: "Class";
	readonly kind_interface: "Interface";
	readonly kind_constructor: "Constructor";
	readonly kind_property: "Property";
	readonly kind_method: "Method";
	readonly kind_call_signature: "Call Signature";
	readonly kind_index_signature: "Index Signature";
	readonly kind_constructor_signature: "Constructor Signature";
	readonly kind_parameter: "Parameter";
	readonly kind_type_literal: "Type Literal";
	readonly kind_type_parameter: "Type Parameter";
	readonly kind_accessor: "Accessor";
	readonly kind_get_signature: "Get Signature";
	readonly kind_set_signature: "Set Signature";
	readonly kind_type_alias: "Type Alias";
	readonly kind_reference: "Reference";
	readonly kind_document: "Document";
	readonly kind_plural_project: "Projects";
	readonly kind_plural_module: "Modules";
	readonly kind_plural_namespace: "Namespaces";
	readonly kind_plural_enum: "Enumerations";
	readonly kind_plural_enum_member: "Enumeration Members";
	readonly kind_plural_variable: "Variables";
	readonly kind_plural_function: "Functions";
	readonly kind_plural_class: "Classes";
	readonly kind_plural_interface: "Interfaces";
	readonly kind_plural_constructor: "Constructors";
	readonly kind_plural_property: "Properties";
	readonly kind_plural_method: "Methods";
	readonly kind_plural_call_signature: "Call Signatures";
	readonly kind_plural_index_signature: "Index Signatures";
	readonly kind_plural_constructor_signature: "Constructor Signatures";
	readonly kind_plural_parameter: "Parameters";
	readonly kind_plural_type_literal: "Type Literals";
	readonly kind_plural_type_parameter: "Type Parameters";
	readonly kind_plural_accessor: "Accessors";
	readonly kind_plural_get_signature: "Get Signatures";
	readonly kind_plural_set_signature: "Set Signatures";
	readonly kind_plural_type_alias: "Type Aliases";
	readonly kind_plural_reference: "References";
	readonly kind_plural_document: "Documents";
	readonly flag_private: "Private";
	readonly flag_protected: "Protected";
	readonly flag_public: "Public";
	readonly flag_static: "Static";
	readonly flag_external: "External";
	readonly flag_optional: "Optional";
	readonly flag_rest: "Rest";
	readonly flag_abstract: "Abstract";
	readonly flag_const: "Const";
	readonly flag_readonly: "Readonly";
	readonly flag_inherited: "Inherited";
	readonly theme_implements: "Implements";
	readonly theme_indexable: "Indexable";
	readonly theme_type_declaration: "Type declaration";
	readonly theme_index: "Index";
	readonly theme_hierarchy: "Hierarchy";
	readonly theme_hierarchy_view_full: "view full";
	readonly theme_implemented_by: "Implemented by";
	readonly theme_defined_in: "Defined in";
	readonly theme_implementation_of: "Implementation of";
	readonly theme_inherited_from: "Inherited from";
	readonly theme_overrides: "Overrides";
	readonly theme_returns: "Returns";
	readonly theme_re_exports: "Re-exports";
	readonly theme_renames_and_re_exports: "Renames and re-exports";
	readonly theme_generated_using_typedoc: "Generated using TypeDoc";
	readonly theme_class_hierarchy_title: "Class Hierarchy";
	readonly theme_preparing_search_index: "Preparing search index...";
	readonly theme_search_index_not_available: "The search index is not available";
	readonly theme_loading: "Loading...";
	readonly theme_settings: "Settings";
	readonly theme_member_visibility: "Member Visibility";
	readonly theme_theme: "Theme";
	readonly theme_os: "OS";
	readonly theme_light: "Light";
	readonly theme_dark: "Dark";
	readonly theme_on_this_page: "On This Page";
	readonly theme_search: "Search";
	readonly theme_menu: "Menu";
	readonly theme_permalink: "Permalink";
	readonly theme_copy: "Copy";
	readonly theme_copied: "Copied!";
	readonly theme_normally_hidden: "This member is normally hidden due to your filter settings.";
};
export type BuiltinTranslatableStringArgs = {
	[K in keyof typeof translatable]: BuildTranslationArguments<
		(typeof translatable)[K]
	>;
} & Record<

		| (typeof blockTags)[number]
		| (typeof inlineTags)[number]
		| (typeof modifierTags)[number] extends `@${infer T}`
		? `tag_${T}`
		: never,
	[]
>;
type BuildTranslationArguments<
	T extends string,
	Acc extends any[] = [],
> = T extends `${string}{${bigint}}${infer R}`
	? BuildTranslationArguments<R, [...Acc, string]>
	: Acc;
export type BuiltinTranslatableStringConstraints = {
	[K in keyof BuiltinTranslatableStringArgs]: TranslationConstraint[BuiltinTranslatableStringArgs[K]["length"]];
};
type BuildConstraint<
	T extends number,
	Acc extends string = "",
	U extends number = T,
> = [T] extends [never]
	? `${Acc}${string}`
	: T extends T
		? BuildConstraint<Exclude<U, T>, `${Acc}${string}{${T}}`>
		: never;
type TranslationConstraint = [
	string,
	BuildConstraint<0>,
	BuildConstraint<0 | 1>,
	BuildConstraint<0 | 1 | 2>,
];
export {};

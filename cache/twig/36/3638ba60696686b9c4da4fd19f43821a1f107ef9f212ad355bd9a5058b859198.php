<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* forms/fields/acl_picker/acl_picker.html.twig */
class __TwigTemplate_337e3a0b40ea0fa4c07e2c387e46965854caa56f93f8598f77ddb228a893b094 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'input' => [$this, 'block_input'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "forms/field.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("forms/field.html.twig", "forms/fields/acl_picker/acl_picker.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["permissions"] = $this->getAttribute(($context["grav"] ?? null), "permissions", []);
        // line 5
        echo "    ";
        $context["classes"] = ["" => "status-unchecked", 1 => "status-checked", 0 => "status-indeterminate"];
        // line 6
        echo "    ";
        $context["states"] = ["" => 0, 1 => 1, 0 => 2];
        // line 7
        echo "
    ";
        // line 8
        if (($this->getAttribute(($context["field"] ?? null), "data_type", []) == "access")) {
            // line 9
            echo "        ";
            $context["groupsList"] = [];
            // line 10
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["permissions"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["action"]) {
                // line 11
                echo "            ";
                if (((($this->getAttribute($context["action"], "visible", [], "any", true, true) &&  !(null === $this->getAttribute($context["action"], "visible", [])))) ? ($this->getAttribute($context["action"], "visible", [])) : (true))) {
                    // line 12
                    echo "            ";
                    $context["groupsList"] = twig_array_merge(($context["groupsList"] ?? null), [0 => ["label" => $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, $this->getAttribute($context["action"], "label", [])), "value" => $this->getAttribute($context["action"], "name", [])]]);
                    // line 13
                    echo "            ";
                }
                // line 14
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['action'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 15
            echo "
        ";
            // line 16
            $context["optionsList"] = [];
            // line 17
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["permissions"] ?? null), "instances", []));
            foreach ($context['_seq'] as $context["_key"] => $context["action"]) {
                // line 18
                echo "            ";
                if (((($this->getAttribute($context["action"], "visible", [], "any", true, true) &&  !(null === $this->getAttribute($context["action"], "visible", [])))) ? ($this->getAttribute($context["action"], "visible", [])) : (true))) {
                    // line 19
                    echo "            ";
                    $context["label"] = ((($this->getAttribute($this->getAttribute($context["action"], "params", []), "letter", [])) ? (($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, $this->getAttribute($this->getAttribute($context["action"], "parent", []), "label", [])) . " > ")) : ("")) . $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, $this->getAttribute($context["action"], "label", [])));
                    // line 20
                    echo "            ";
                    $context["optionsList"] = twig_array_merge(($context["optionsList"] ?? null), [0 => ["text" => (((($context["label"] ?? null) . " (") . $this->getAttribute($context["action"], "name", [])) . ")"), "value" => $this->getAttribute($context["action"], "name", []), "optgroup" => $this->getAttribute($context["action"], "scope", [])]]);
                    // line 21
                    echo "            ";
                }
                // line 22
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['action'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 23
            echo "    ";
        } elseif (($this->getAttribute(($context["field"] ?? null), "data_type", []) == "permissions")) {
            // line 24
            echo "        ";
            $context["groups"] = $this->getAttribute($this->getAttribute(($context["grav"] ?? null), "flex", []), "directory", [0 => "user-groups"], "method");
            // line 25
            echo "        ";
            $context["groupsList"] = [];
            // line 26
            echo "        ";
            $context["crudp"] = ["create" => ["letter" => "C", "title" => "Create", "value" => ""], "read" => ["letter" => "R", "title" => "Read", "value" => ""], "update" => ["letter" => "U", "title" => "Update", "value" => ""], "delete" => ["letter" => "D", "title" => "Delete", "value" => ""]];
            // line 32
            echo "
        ";
            // line 33
            if ($this->getAttribute(($context["object"] ?? null), "hasFlexFeature", [0 => "page"], "method")) {
                // line 34
                echo "            ";
                $context["optionsList"] = [0 => ["text" => "Page Authors (Special)", "value" => "authors"], 1 => ["text" => "Default ACL (Special)", "value" => "defaults"]];
                // line 35
                echo "        ";
            } else {
                // line 36
                echo "            ";
                $context["optionsList"] = [];
                // line 37
                echo "        ";
            }
            // line 38
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["groups"] ?? null), "index", []));
            foreach ($context['_seq'] as $context["_key"] => $context["group"]) {
                // line 39
                echo "        ";
                $context["optionsList"] = twig_array_merge(($context["optionsList"] ?? null), [0 => ["text" => ((($this->getAttribute($context["group"], "readableName", [], "any", true, true) &&  !(null === $this->getAttribute($context["group"], "readableName", [])))) ? ($this->getAttribute($context["group"], "readableName", [])) : ($this->getAttribute($context["group"], "groupname", []))), "value" => $this->getAttribute($context["group"], "groupname", [])]]);
                // line 40
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['group'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 41
            echo "    ";
        }
        // line 42
        echo "
    <template data-id=\"acl_picker-";
        // line 43
        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "name", []), "html", null, true);
        echo "\">
        <div class=\"permissions-item\" data-field-type=\"";
        // line 44
        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "data_type", []), "html", null, true);
        echo "\">
            <a href=\"#\" class=\"remove-item\"><i class=\"fa fa-trash\"></i></a>
            <select data-grav-selectize=\"";
        // line 46
        echo twig_escape_filter($this->env, twig_jsonencode_filter(["options" => ($context["optionsList"] ?? null), "optgroups" => ($context["groupsList"] ?? null)]), "html", null, true);
        echo "\"></select>

            ";
        // line 48
        if (($this->getAttribute(($context["field"] ?? null), "data_type", []) == "access")) {
            // line 49
            echo "            <div class=\"switch-toggle switch-grav medium switch-3\">
                <input type=\"radio\" value=\"1\" id=\"";
            // line 50
            echo twig_escape_filter($this->env, ($this->getAttribute(($context["field"] ?? null), "name", []) . "_"), "html", null, true);
            echo "\" name=\"";
            echo twig_escape_filter($this->env, ($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))) . "[]"), "html", null, true);
            echo "\" class=\"label1\" checked>

                <label for=\"";
            // line 52
            echo twig_escape_filter($this->env, ($this->getAttribute(($context["field"] ?? null), "name", []) . "_"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.ALLOWED"), "html", null, true);
            echo "</label>

                <input type=\"radio\" value=\"0\" id=\"";
            // line 54
            echo twig_escape_filter($this->env, ($this->getAttribute(($context["field"] ?? null), "name", []) . "_"), "html", null, true);
            echo "\" name=\"";
            echo twig_escape_filter($this->env, ($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))) . "[]"), "html", null, true);
            echo "\" class=\"label0\">

                <label for=\"";
            // line 56
            echo twig_escape_filter($this->env, ($this->getAttribute(($context["field"] ?? null), "name", []) . "_"), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.DENIED"), "html", null, true);
            echo "</label>

            </div>
            ";
        } elseif (($this->getAttribute(        // line 59
($context["field"] ?? null), "data_type", []) == "permissions")) {
            // line 60
            echo "                ";
            $context["data_field_name"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter(((($context["scope"] ?? null) . "_json.") . $this->getAttribute(($context["field"] ?? null), "name", [])));
            // line 61
            echo "                <div class=\"crudp-container\" data-field-name=\"";
            echo twig_escape_filter($this->env, (($context["data_field_name"] ?? null) . "[]"), "html", null, true);
            echo "\">
                    ";
            // line 62
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["crudp"] ?? null));
            foreach ($context['_seq'] as $context["key"] => $context["button"]) {
                // line 63
                echo "                        <div>
                            <span class=\"checkboxes indeterminate toggleable status-unchecked hint--top\"
                                  data-_check-status=\"0\"
                                  data-hint=\"";
                // line 66
                echo twig_escape_filter($this->env, $this->getAttribute($context["button"], "title", []), "html", null, true);
                echo "\">
                                <input type=\"checkbox\"
                                       id=\"";
                // line 68
                echo twig_escape_filter($this->env, ((($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . $context["key"]) . "_"), "html", null, true);
                echo "\"
                                       data-crudp-key=\"";
                // line 69
                echo twig_escape_filter($this->env, $context["key"], "html", null, true);
                echo "\"
                                      ";
                // line 71
                echo "                                       indeterminte=\"false\" value=\"\">
                                <label for=\"";
                // line 72
                echo twig_escape_filter($this->env, ((($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . $context["key"]) . "_"), "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, $this->getAttribute($context["button"], "letter", []), "html", null, true);
                echo "</label>
                            </span>
                        </div>
                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['button'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 76
            echo "
                    <input type=\"hidden\" name=\"";
            // line 77
            echo twig_escape_filter($this->env, (((($context["data_field_name"] ?? null) . "[][") . ($context["key"] ?? null)) . "]"), "html", null, true);
            echo "\">
                </div>
            ";
        }
        // line 80
        echo "            <button class=\"button add-item\"><i class=\"fa fa-plus\"></i></button>
        </div>
    </template>


    <div class=\"permissions-container\" data-acl_picker_id=\"";
        // line 85
        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "name", []), "html", null, true);
        echo "\" data-acl_picker=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(["options" => ($context["optionsList"] ?? null), "optgroups" => ($context["groupsList"] ?? null)]), "html", null, true);
        echo "\">
        <div class=\"permissions-item empty-list ";
        // line 86
        echo ((twig_length_filter($this->env, ($context["value"] ?? null))) ? ("hidden") : (""));
        echo "\">
            <a href=\"#\" class=\"button add-item\"><i class=\"fa fa-plus\"></i></a>
        </div>

        ";
        // line 90
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["value"] ?? null));
        foreach ($context['_seq'] as $context["key"] => $context["access"]) {
            // line 91
            echo "            <div class=\"permissions-item\" data-field-type=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "data_type", []), "html", null, true);
            echo "\">
                <a href=\"#\" class=\"remove-item\"><i class=\"fa fa-trash\"></i></a>
                <select data-grav-selectize=\"";
            // line 93
            echo twig_escape_filter($this->env, twig_jsonencode_filter(["options" => ($context["optionsList"] ?? null), "optgroups" => ($context["groupsList"] ?? null)]), "html", null, true);
            echo "\">
                    <option value=\"";
            // line 94
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "\" selected>";
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "</option>
                </select>
                ";
            // line 96
            if (($this->getAttribute(($context["field"] ?? null), "data_type", []) == "access")) {
                // line 97
                echo "                <div class=\"switch-toggle switch-grav medium switch-3\">
                    ";
                // line 98
                $context["rnd"] = twig_random($this->env, 100);
                // line 99
                echo "                    <input type=\"radio\" value=\"1\" id=\"";
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . ($context["rnd"] ?? null)), "html", null, true);
                echo "\" name=\"";
                echo twig_escape_filter($this->env, ((($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))) . "[") . $context["key"]) . "]"), "html", null, true);
                echo "\" class=\"label1\" ";
                echo (($context["access"]) ? ("checked") : (""));
                echo ">

                    <label for=\"";
                // line 101
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . ($context["rnd"] ?? null)), "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.ALLOWED"), "html", null, true);
                echo "</label>

                    ";
                // line 103
                $context["rnd"] = twig_random($this->env, 100);
                // line 104
                echo "                    <input type=\"radio\" value=\"0\" id=\"";
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . ($context["rnd"] ?? null)), "html", null, true);
                echo "\" name=\"";
                echo twig_escape_filter($this->env, ((($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))) . "[") . $context["key"]) . "]"), "html", null, true);
                echo "\" class=\"label0\" ";
                echo (( !$context["access"]) ? ("checked") : (""));
                echo ">

                    <label for=\"";
                // line 106
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . ($context["rnd"] ?? null)), "html", null, true);
                echo "\">";
                echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.DENIED"), "html", null, true);
                echo "</label>

                </div>
                ";
            } elseif (($this->getAttribute(            // line 109
($context["field"] ?? null), "data_type", []) == "permissions")) {
                // line 110
                echo "                    ";
                $context["data_field_name"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter(((($context["scope"] ?? null) . "_json.") . $this->getAttribute(($context["field"] ?? null), "name", [])));
                // line 111
                echo "                    <div class=\"crudp-container\" data-field-name=\"";
                echo twig_escape_filter($this->env, (($context["data_field_name"] ?? null) . "[]"), "html", null, true);
                echo "\">
                        ";
                // line 112
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["crudp"] ?? null));
                foreach ($context['_seq'] as $context["crudp_key"] => $context["button"]) {
                    // line 113
                    echo "                            <div>
                                ";
                    // line 114
                    $context["crudp_value"] = $this->getAttribute($this->getAttribute(($context["value"] ?? null), $context["key"], [], "array"), $context["crudp_key"], [], "array");
                    // line 115
                    echo "                                <span class=\"checkboxes indeterminate toggleable ";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["classes"] ?? null), ($context["crudp_value"] ?? null), [], "array"), "html", null, true);
                    echo " hint--top\"
                                      data-_check-status=\"";
                    // line 116
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["states"] ?? null), ($context["crudp_value"] ?? null), [], "array"), "html", null, true);
                    echo "\"
                                      data-hint=\"";
                    // line 117
                    echo twig_escape_filter($this->env, $this->getAttribute($context["button"], "title", []), "html", null, true);
                    echo "\">
                                    <input type=\"checkbox\"
                                           id=\"";
                    // line 119
                    echo twig_escape_filter($this->env, ((($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . $context["crudp_key"]) . "_"), "html", null, true);
                    echo "\"
                                           data-crudp-key=\"";
                    // line 120
                    echo twig_escape_filter($this->env, $context["crudp_key"], "html", null, true);
                    echo "\"
                                           ";
                    // line 122
                    echo "                                           indeterminate=\"false\" value=\"";
                    echo twig_escape_filter($this->env, ($context["crudp_value"] ?? null), "html", null, true);
                    echo "\">
                                    <label for=\"";
                    // line 123
                    echo twig_escape_filter($this->env, ((($this->getAttribute(($context["field"] ?? null), "name", []) . "_") . $context["crudp_key"]) . "_"), "html", null, true);
                    echo "\">";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["button"], "letter", []), "html", null, true);
                    echo "</label>
                                </span>
                            </div>
                        ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['crudp_key'], $context['button'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 127
                echo "                        <input type=\"hidden\" name=\"";
                echo twig_escape_filter($this->env, (((($context["data_field_name"] ?? null) . "[") . $context["key"]) . "]"), "html", null, true);
                echo "\" value=\"";
                echo twig_escape_filter($this->env, twig_jsonencode_filter((($this->getAttribute(($context["value"] ?? null), $context["key"], [], "array", true, true)) ? (_twig_default_filter($this->getAttribute(($context["value"] ?? null), $context["key"], [], "array"), [])) : ([]))), "html", null, true);
                echo "\">
                    </div>
                ";
            }
            // line 130
            echo "                <button class=\"button add-item\"><i class=\"fa fa-plus\"></i></button>
            </div>
        ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['access'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 133
        echo "    </div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/acl_picker/acl_picker.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  420 => 133,  412 => 130,  403 => 127,  391 => 123,  386 => 122,  382 => 120,  378 => 119,  373 => 117,  369 => 116,  364 => 115,  362 => 114,  359 => 113,  355 => 112,  350 => 111,  347 => 110,  345 => 109,  337 => 106,  327 => 104,  325 => 103,  318 => 101,  308 => 99,  306 => 98,  303 => 97,  301 => 96,  294 => 94,  290 => 93,  284 => 91,  280 => 90,  273 => 86,  267 => 85,  260 => 80,  254 => 77,  251 => 76,  239 => 72,  236 => 71,  232 => 69,  228 => 68,  223 => 66,  218 => 63,  214 => 62,  209 => 61,  206 => 60,  204 => 59,  196 => 56,  189 => 54,  182 => 52,  175 => 50,  172 => 49,  170 => 48,  165 => 46,  160 => 44,  156 => 43,  153 => 42,  150 => 41,  144 => 40,  141 => 39,  136 => 38,  133 => 37,  130 => 36,  127 => 35,  124 => 34,  122 => 33,  119 => 32,  116 => 26,  113 => 25,  110 => 24,  107 => 23,  101 => 22,  98 => 21,  95 => 20,  92 => 19,  89 => 18,  84 => 17,  82 => 16,  79 => 15,  73 => 14,  70 => 13,  67 => 12,  64 => 11,  59 => 10,  56 => 9,  54 => 8,  51 => 7,  48 => 6,  45 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"forms/field.html.twig\" %}

{% block input %}
    {% set permissions = grav.permissions %}
    {% set classes = { '': 'status-unchecked', 1: 'status-checked', 0: 'status-indeterminate' } %}
    {% set states = { '': 0, 1: 1, 0: 2 } %}

    {% if field.data_type == 'access' %}
        {% set groupsList = [] %}
        {% for action in permissions %}
            {% if (action.visible ?? true) %}
            {% set groupsList = groupsList|merge([{ label: action.label|t, value: action.name }]) %}
            {% endif %}
        {% endfor %}

        {% set optionsList = [] %}
        {% for action in permissions.instances %}
            {% if (action.visible ?? true) %}
            {% set label  = (action.params.letter ? action.parent.label|t ~ ' > ') ~ action.label|t %}
            {% set optionsList = optionsList|merge([{ text: label ~ ' (' ~ action.name ~ ')', value: action.name, optgroup: action.scope }]) %}
            {% endif %}
        {% endfor %}
    {% elseif field.data_type == 'permissions' %}
        {% set groups = grav.flex.directory('user-groups') %}
        {% set groupsList = [] %}
        {% set crudp = {
            create: { letter: 'C', title: 'Create', value: '' },
            read: { letter: 'R', title: 'Read', value: '' },
            update: { letter: 'U', title: 'Update', value: '' },
            delete: { letter: 'D', title: 'Delete', value: '' }
        } %}

        {% if object.hasFlexFeature('page') %}
            {% set optionsList = [{text: 'Page Authors (Special)', value: 'authors'}, {text: 'Default ACL (Special)', value: 'defaults'}] %}
        {% else %}
            {% set optionsList = [] %}
        {% endif %}
        {% for group in groups.index %}
        {% set optionsList = optionsList|merge([{ text: group.readableName ?? group.groupname, value: group.groupname }]) %}
        {% endfor %}
    {% endif %}

    <template data-id=\"acl_picker-{{ field.name }}\">
        <div class=\"permissions-item\" data-field-type=\"{{ field.data_type }}\">
            <a href=\"#\" class=\"remove-item\"><i class=\"fa fa-trash\"></i></a>
            <select data-grav-selectize=\"{{ { options: optionsList, optgroups: groupsList }|json_encode }}\"></select>

            {% if field.data_type == 'access' %}
            <div class=\"switch-toggle switch-grav medium switch-3\">
                <input type=\"radio\" value=\"1\" id=\"{{ field.name ~ '_' }}\" name=\"{{ (scope ~ field.name)|fieldName ~ '[]' }}\" class=\"label1\" checked>

                <label for=\"{{ field.name ~ '_' }}\">{{ 'PLUGIN_ADMIN.ALLOWED'|t }}</label>

                <input type=\"radio\" value=\"0\" id=\"{{ field.name ~ '_' }}\" name=\"{{ (scope ~ field.name)|fieldName ~ '[]' }}\" class=\"label0\">

                <label for=\"{{ field.name ~ '_' }}\">{{ 'PLUGIN_ADMIN.DENIED'|t }}</label>

            </div>
            {% elseif field.data_type == 'permissions' %}
                {% set data_field_name = (scope ~ '_json.' ~ field.name)|fieldName %}
                <div class=\"crudp-container\" data-field-name=\"{{ data_field_name ~ '[]' }}\">
                    {% for key, button in crudp %}
                        <div>
                            <span class=\"checkboxes indeterminate toggleable status-unchecked hint--top\"
                                  data-_check-status=\"0\"
                                  data-hint=\"{{ button.title }}\">
                                <input type=\"checkbox\"
                                       id=\"{{ field.name ~ '_' ~ key ~ '_' }}\"
                                       data-crudp-key=\"{{ key }}\"
                                      {# name=\"{{ (scope ~ field.name)|fieldName ~ '[][' ~ key ~ ']' }}\"#}
                                       indeterminte=\"false\" value=\"\">
                                <label for=\"{{ field.name ~ '_' ~ key ~ '_' }}\">{{ button.letter }}</label>
                            </span>
                        </div>
                    {% endfor %}

                    <input type=\"hidden\" name=\"{{ data_field_name ~ '[][' ~ key ~ ']' }}\">
                </div>
            {% endif %}
            <button class=\"button add-item\"><i class=\"fa fa-plus\"></i></button>
        </div>
    </template>


    <div class=\"permissions-container\" data-acl_picker_id=\"{{ field.name }}\" data-acl_picker=\"{{ { options: optionsList, optgroups: groupsList }|json_encode }}\">
        <div class=\"permissions-item empty-list {{ value|length ? 'hidden' }}\">
            <a href=\"#\" class=\"button add-item\"><i class=\"fa fa-plus\"></i></a>
        </div>

        {% for key, access in value %}
            <div class=\"permissions-item\" data-field-type=\"{{ field.data_type }}\">
                <a href=\"#\" class=\"remove-item\"><i class=\"fa fa-trash\"></i></a>
                <select data-grav-selectize=\"{{ { options: optionsList, optgroups: groupsList }|json_encode }}\">
                    <option value=\"{{ key }}\" selected>{{ key }}</option>
                </select>
                {% if field.data_type == 'access' %}
                <div class=\"switch-toggle switch-grav medium switch-3\">
                    {% set rnd = random(100) %}
                    <input type=\"radio\" value=\"1\" id=\"{{ field.name ~ '_' ~ rnd }}\" name=\"{{ (scope ~ field.name)|fieldName ~ '[' ~ key ~ ']' }}\" class=\"label1\" {{ access ? 'checked' }}>

                    <label for=\"{{ field.name ~ '_' ~ rnd }}\">{{ 'PLUGIN_ADMIN.ALLOWED'|t }}</label>

                    {% set rnd = random(100) %}
                    <input type=\"radio\" value=\"0\" id=\"{{ field.name ~ '_' ~ rnd }}\" name=\"{{ (scope ~ field.name)|fieldName ~ '[' ~ key ~ ']' }}\" class=\"label0\" {{ not access ? 'checked' }}>

                    <label for=\"{{ field.name ~ '_' ~ rnd }}\">{{ 'PLUGIN_ADMIN.DENIED'|t }}</label>

                </div>
                {% elseif field.data_type == 'permissions' %}
                    {% set data_field_name = (scope ~ '_json.' ~ field.name)|fieldName %}
                    <div class=\"crudp-container\" data-field-name=\"{{ data_field_name ~ '[]' }}\">
                        {% for crudp_key, button in crudp %}
                            <div>
                                {% set crudp_value = value[key][crudp_key] %}
                                <span class=\"checkboxes indeterminate toggleable {{ classes[crudp_value] }} hint--top\"
                                      data-_check-status=\"{{ states[crudp_value] }}\"
                                      data-hint=\"{{ button.title }}\">
                                    <input type=\"checkbox\"
                                           id=\"{{ field.name ~ '_' ~ crudp_key ~ '_' }}\"
                                           data-crudp-key=\"{{ crudp_key }}\"
                                           {#name=\"{{ (scope ~ field.name)|fieldName ~ '[' ~ key ~ '][' ~ crudp_key ~ ']' }}\"#}
                                           indeterminate=\"false\" value=\"{{ crudp_value }}\">
                                    <label for=\"{{ field.name ~ '_' ~ crudp_key ~ '_' }}\">{{ button.letter }}</label>
                                </span>
                            </div>
                        {% endfor %}
                        <input type=\"hidden\" name=\"{{ data_field_name ~ '[' ~ key ~ ']' }}\" value=\"{{ value[key]|default([])|json_encode }}\">
                    </div>
                {% endif %}
                <button class=\"button add-item\"><i class=\"fa fa-plus\"></i></button>
            </div>
        {% endfor %}
    </div>
{% endblock %}
", "forms/fields/acl_picker/acl_picker.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\forms\\fields\\acl_picker\\acl_picker.html.twig");
    }
}
